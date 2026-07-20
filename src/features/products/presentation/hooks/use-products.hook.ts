import { useEffect, useState } from 'react';
import type { Product } from '../../domain/entities/product.entity';
import type { CommissionRate } from '../../domain/entities/commission-rate.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';
import type { productsContainer } from '../../products.container';

const PAGE_SIZE = 10;

export interface ProductFormState {
  nome: string;
  percentualComissaoId: string;
}

const EMPTY_FORM: ProductFormState = { nome: '', percentualComissaoId: '' };

export function useProducts(products: typeof productsContainer) {
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<OffsetPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([]);

  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
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

    products
      .listProducts({ page, limit: PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        setItems(result.products);
        setPagination(result.pagination);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro ao carregar as chapas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [products, page, refreshKey]);

  useEffect(() => {
    let active = true;
    products.listCommissionRateOptions().then((result) => {
      if (active) setCommissionRates(result);
    });
    return () => {
      active = false;
    };
  }, [products]);

  const hasNextPage = !!pagination && pagination.next !== null;
  const hasPreviousPage = page > 1;

  function setNome(value: string) {
    setForm((current) => ({ ...current, nome: value }));
  }

  function setPercentualComissaoId(value: string) {
    setForm((current) => ({ ...current, percentualComissaoId: value }));
  }

  function startEdit(product: Product) {
    setForm({ nome: product.name, percentualComissaoId: String(product.defaultCommissionRateId) });
    setEditingId(product.id);
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  const isValid = form.nome.trim() !== '' && form.percentualComissaoId !== '';

  async function submit() {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const params = { name: form.nome.trim(), defaultCommissionRateId: Number(form.percentualComissaoId) };
      const wasEditing = editingId !== null;
      if (editingId !== null) {
        await products.updateProduct(editingId, params);
      } else {
        await products.createProduct(params);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      showToast(wasEditing ? 'Chapa atualizada!' : 'Chapa adicionada!');
      if (page === 1) refresh();
      else setPage(1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar a chapa.', 'danger');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Excluir "${product.name}"?`)) return;
    try {
      await products.deleteProduct(product.id);
      showToast('Chapa removida.');
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao remover a chapa.', 'danger');
    }
  }

  return {
    products: items,
    loading,
    error,
    page,
    hasNextPage,
    hasPreviousPage,
    goToNextPage: () => hasNextPage && setPage((current) => current + 1),
    goToPreviousPage: () => hasPreviousPage && setPage((current) => current - 1),
    commissionRates,
    form,
    setNome,
    setPercentualComissaoId,
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
