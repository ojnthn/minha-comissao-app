import { useEffect, useState } from 'react';
import type { Product } from '../../domain/entities/product.entity';
import type { CommissionRate } from '../../domain/entities/commission-rate.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';
import type { productsContainer } from '../../products.container';

const PAGE_SIZE = 10;
const COMMISSION_RATE_PAGE_SIZE = 10;

const EMPTY_NOME = '';

export function useProducts(products: typeof productsContainer) {
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<OffsetPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loadedCommissionRates, setLoadedCommissionRates] = useState<CommissionRate[]>([]);
  const [commissionRatePage, setCommissionRatePage] = useState(1);
  const [commissionRateHasMore, setCommissionRateHasMore] = useState(false);
  const [commissionRateLoading, setCommissionRateLoading] = useState(false);
  const [commissionRateSearch, setCommissionRateSearch] = useState('');

  const [nome, setNome] = useState(EMPTY_NOME);
  const [valorPorM2, setValorPorM2] = useState(EMPTY_NOME);
  const [selectedCommissionRate, setSelectedCommissionRate] = useState<CommissionRate | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState(EMPTY_NOME);

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
      .listProducts({ page, limit: PAGE_SIZE, nome: searchTerm.trim() || undefined })
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
  }, [products, page, refreshKey, searchTerm]);

  function search(term: string) {
    setSearchTerm(term);
    setPage(1);
  }

  useEffect(() => {
    let active = true;
    setCommissionRateLoading(true);

    products
      .listCommissionRates({ page: 1, limit: COMMISSION_RATE_PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        setLoadedCommissionRates(result.commissionRates);
        setCommissionRatePage(1);
        setCommissionRateHasMore(result.pagination.next !== null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCommissionRateLoading(false);
      });

    return () => {
      active = false;
    };
  }, [products]);

  async function loadMoreCommissionRates() {
    if (!commissionRateHasMore || commissionRateLoading) return;
    const nextPage = commissionRatePage + 1;
    setCommissionRateLoading(true);
    try {
      const result = await products.listCommissionRates({ page: nextPage, limit: COMMISSION_RATE_PAGE_SIZE });
      setLoadedCommissionRates((current) => [...current, ...result.commissionRates]);
      setCommissionRatePage(nextPage);
      setCommissionRateHasMore(result.pagination.next !== null);
    } catch {
      // mantém hasMore como estava — usuário pode tentar rolar de novo
    } finally {
      setCommissionRateLoading(false);
    }
  }

  const hasNextPage = !!pagination && pagination.next !== null;
  const hasPreviousPage = page > 1;

  const trimmedCommissionRateSearch = commissionRateSearch.trim().toLowerCase();
  /** Backend (`GET /comissao-porcentagem`) só tem page/limit, sem filtro de busca — a busca aqui é client-side sobre o que já foi carregado, não sobre o catálogo inteiro. */
  const filteredCommissionRateOptions = trimmedCommissionRateSearch
    ? loadedCommissionRates.filter((rate) => rate.name.toLowerCase().includes(trimmedCommissionRateSearch))
    : loadedCommissionRates;
  const effectiveCommissionRateHasMore = trimmedCommissionRateSearch ? false : commissionRateHasMore;
  const commissionRateNameById = new Map(loadedCommissionRates.map((rate) => [rate.id, rate.name]));

  function startEdit(product: Product) {
    const known = loadedCommissionRates.find((rate) => rate.id === product.defaultCommissionRateId);
    setNome(product.name);
    setValorPorM2(String(product.pricePerM2));
    setSelectedCommissionRate(known ?? { id: product.defaultCommissionRateId, name: `Comissão #${product.defaultCommissionRateId}` });
    setEditingId(product.id);
  }

  function cancelEdit() {
    setNome(EMPTY_NOME);
    setValorPorM2(EMPTY_NOME);
    setSelectedCommissionRate(null);
    setEditingId(null);
  }

  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  const parsedValorPorM2 = Number(valorPorM2.replace(',', '.'));
  const isValid =
    nome.trim() !== '' && valorPorM2.trim() !== '' && Number.isFinite(parsedValorPorM2) && selectedCommissionRate !== null;

  async function submit() {
    if (!isValid || !selectedCommissionRate) return;
    setSubmitting(true);
    try {
      const params = {
        name: nome.trim(),
        pricePerM2: parsedValorPorM2,
        defaultCommissionRateId: selectedCommissionRate.id,
      };
      const wasEditing = editingId !== null;
      if (editingId !== null) {
        await products.updateProduct(editingId, params);
      } else {
        await products.createProduct(params);
      }
      setNome(EMPTY_NOME);
      setValorPorM2(EMPTY_NOME);
      setSelectedCommissionRate(null);
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
    commissionRateOptions: filteredCommissionRateOptions,
    commissionRateNameById,
    commissionRateLoading,
    commissionRateHasMore: effectiveCommissionRateHasMore,
    onCommissionRateSearchChange: setCommissionRateSearch,
    loadMoreCommissionRates,
    hasAnyCommissionRate: loadedCommissionRates.length > 0,
    nome,
    setNome,
    valorPorM2,
    setValorPorM2,
    searchTerm,
    search,
    selectedCommissionRate,
    setSelectedCommissionRate,
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
