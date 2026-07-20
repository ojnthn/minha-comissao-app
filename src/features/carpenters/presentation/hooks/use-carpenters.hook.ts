import { useEffect, useState } from 'react';
import type { Carpenter } from '../../domain/entities/carpenter.entity';
import type { RepeatingPagination } from '../../../../shared/types/pagination';
import type { carpentersContainer } from '../../carpenters.container';

const PAGE_SIZE = 10;

const EMPTY_NOME = '';

export function useCarpenters(carpenters: typeof carpentersContainer) {
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [items, setItems] = useState<Carpenter[]>([]);
  const [pagination, setPagination] = useState<RepeatingPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState(EMPTY_NOME);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'danger' } | null>(null);

  function showToast(message: string, variant: 'success' | 'danger' = 'success') {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    carpenters
      .listCarpenters({ page, limit: PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        setItems(result.carpenters);
        setPagination(result.pagination);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar os marceneiros.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [carpenters, page, refreshKey]);

  const hasNextPage = !!pagination && pagination.next !== pagination.current;
  const hasPreviousPage = page > 1;

  function startEdit(carpenter: Carpenter) {
    setNome(carpenter.name);
    setEditingId(carpenter.id);
  }

  function cancelEdit() {
    setNome(EMPTY_NOME);
    setEditingId(null);
  }

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  const isValid = nome.trim() !== '';

  async function submit() {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const params = { name: nome.trim() };
      const wasEditing = editingId !== null;
      if (editingId !== null) {
        await carpenters.updateCarpenter(editingId, params);
      } else {
        await carpenters.createCarpenter(params);
      }
      setNome(EMPTY_NOME);
      setEditingId(null);
      showToast(wasEditing ? 'Marceneiro atualizado!' : 'Marceneiro adicionado!');
      if (page === 1) refresh();
      else setPage(1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar o marceneiro.', 'danger');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(carpenter: Carpenter) {
    if (!window.confirm(`Excluir "${carpenter.name}"?`)) return;
    try {
      await carpenters.deleteCarpenter(carpenter.id);
      showToast('Marceneiro removido.');
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao remover o marceneiro.', 'danger');
    }
  }

  return {
    carpenters: items,
    loading,
    error,
    page,
    hasNextPage,
    hasPreviousPage,
    goToNextPage: () => hasNextPage && setPage((current) => current + 1),
    goToPreviousPage: () => hasPreviousPage && setPage((current) => current - 1),
    nome,
    setNome,
    isValid,
    isEditing: editingId !== null,
    submitting,
    submit,
    startEdit,
    cancelEdit,
    remove,
    toast,
  };
}
