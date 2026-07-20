import { useEffect, useMemo, useState } from 'react';
import { calculateOrderItemCommission, calculateOrderItemValue, calculateOrderTotals } from '../../domain/entities/order.entity';
import type { OrderItemDraft } from '../../domain/entities/order.entity';
import type {
  OrderFormOptionsPort,
  OrderFormCarpenterOption,
  OrderFormProductOption,
  OrderFormCommissionRateOption,
} from '../../domain/repositories/order-form-options.repository';
import type { ordersContainer } from '../../orders.container';

const CARPENTER_PAGE_SIZE = 10;
const PRODUCT_PAGE_SIZE = 20;
const COMMISSION_RATE_PAGE_SIZE = 20;

const EMPTY = '';

export function useOrderForm(orders: Pick<typeof ordersContainer, 'createOrder'>, formOptions: OrderFormOptionsPort) {
  // marceneiro (busca server-side)
  const [carpenter, setCarpenter] = useState<OrderFormCarpenterOption | null>(null);
  const [carpenterOptions, setCarpenterOptions] = useState<OrderFormCarpenterOption[]>([]);
  const [carpenterPage, setCarpenterPage] = useState(1);
  const [carpenterHasMore, setCarpenterHasMore] = useState(false);
  const [carpenterLoading, setCarpenterLoading] = useState(false);
  const [carpenterSearch, setCarpenterSearch] = useState(EMPTY);

  // chapas (sem busca server-side — carregado uma vez, filtro client-side sobre o que já veio)
  const [loadedProducts, setLoadedProducts] = useState<OrderFormProductOption[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [productHasMore, setProductHasMore] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productSearch, setProductSearch] = useState(EMPTY);

  // percentuais (mesma limitação de comissao-porcentagem: sem busca no backend)
  const [loadedCommissionRates, setLoadedCommissionRates] = useState<OrderFormCommissionRateOption[]>([]);
  const [commissionRatePage, setCommissionRatePage] = useState(1);
  const [commissionRateHasMore, setCommissionRateHasMore] = useState(false);
  const [commissionRateLoading, setCommissionRateLoading] = useState(false);
  const [commissionRateSearch, setCommissionRateSearch] = useState(EMPTY);

  // item em edição (ainda não adicionado à tabela)
  const [selectedProduct, setSelectedProduct] = useState<OrderFormProductOption | null>(null);
  const [m2, setM2] = useState(EMPTY);
  const [selectedCommissionRate, setSelectedCommissionRate] = useState<OrderFormCommissionRateOption | null>(null);

  // pedido em construção
  const [items, setItems] = useState<OrderItemDraft[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'danger' } | null>(null);

  function showToast(message: string, variant: 'success' | 'danger' = 'success') {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    let active = true;
    setCarpenterLoading(true);

    formOptions
      .searchCarpenters({ page: 1, limit: CARPENTER_PAGE_SIZE, search: carpenterSearch.trim() || undefined })
      .then((result) => {
        if (!active) return;
        setCarpenterOptions(result.carpenters);
        setCarpenterPage(1);
        setCarpenterHasMore(result.pagination.next !== result.pagination.current);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCarpenterLoading(false);
      });

    return () => {
      active = false;
    };
  }, [formOptions, carpenterSearch]);

  async function loadMoreCarpenters() {
    if (!carpenterHasMore || carpenterLoading) return;
    const nextPage = carpenterPage + 1;
    setCarpenterLoading(true);
    try {
      const result = await formOptions.searchCarpenters({
        page: nextPage,
        limit: CARPENTER_PAGE_SIZE,
        search: carpenterSearch.trim() || undefined,
      });
      setCarpenterOptions((current) => [...current, ...result.carpenters]);
      setCarpenterPage(nextPage);
      setCarpenterHasMore(result.pagination.next !== result.pagination.current);
    } finally {
      setCarpenterLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    setProductLoading(true);

    formOptions
      .listProducts({ page: 1, limit: PRODUCT_PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        setLoadedProducts(result.products);
        setProductPage(1);
        setProductHasMore(result.pagination.next !== null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setProductLoading(false);
      });

    return () => {
      active = false;
    };
  }, [formOptions]);

  async function loadMoreProducts() {
    if (!productHasMore || productLoading) return;
    const nextPage = productPage + 1;
    setProductLoading(true);
    try {
      const result = await formOptions.listProducts({ page: nextPage, limit: PRODUCT_PAGE_SIZE });
      setLoadedProducts((current) => [...current, ...result.products]);
      setProductPage(nextPage);
      setProductHasMore(result.pagination.next !== null);
    } finally {
      setProductLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    setCommissionRateLoading(true);

    formOptions
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
  }, [formOptions]);

  async function loadMoreCommissionRates() {
    if (!commissionRateHasMore || commissionRateLoading) return;
    const nextPage = commissionRatePage + 1;
    setCommissionRateLoading(true);
    try {
      const result = await formOptions.listCommissionRates({ page: nextPage, limit: COMMISSION_RATE_PAGE_SIZE });
      setLoadedCommissionRates((current) => [...current, ...result.commissionRates]);
      setCommissionRatePage(nextPage);
      setCommissionRateHasMore(result.pagination.next !== null);
    } finally {
      setCommissionRateLoading(false);
    }
  }

  const trimmedProductSearch = productSearch.trim().toLowerCase();
  const productOptions = trimmedProductSearch
    ? loadedProducts.filter((product) => product.name.toLowerCase().includes(trimmedProductSearch))
    : loadedProducts;
  const effectiveProductHasMore = trimmedProductSearch ? false : productHasMore;

  const trimmedCommissionRateSearch = commissionRateSearch.trim().toLowerCase();
  const commissionRateOptions = trimmedCommissionRateSearch
    ? loadedCommissionRates.filter((rate) => rate.label.toLowerCase().includes(trimmedCommissionRateSearch))
    : loadedCommissionRates;
  const effectiveCommissionRateHasMore = trimmedCommissionRateSearch ? false : commissionRateHasMore;

  const parsedM2 = Number(m2.replace(',', '.'));
  const itemIsValid = selectedProduct !== null && Number.isFinite(parsedM2) && parsedM2 > 0 && selectedCommissionRate !== null;

  const itemPreview = useMemo(() => {
    if (!selectedProduct || !selectedCommissionRate || !Number.isFinite(parsedM2)) {
      return { value: 0, commission: 0 };
    }
    const draft = { m2: parsedM2, pricePerM2: selectedProduct.pricePerM2, commissionRatePercent: selectedCommissionRate.percent };
    return { value: calculateOrderItemValue(draft), commission: calculateOrderItemCommission(draft) };
  }, [selectedProduct, selectedCommissionRate, parsedM2]);

  function addItem() {
    if (!itemIsValid || !selectedProduct || !selectedCommissionRate) return;
    if (selectedProduct.pricePerM2 <= 0) {
      showToast(`"${selectedProduct.name}" não tem valor por m² cadastrado. Edite a chapa antes de usá-la num pedido.`, 'danger');
      return;
    }
    const newItem: OrderItemDraft = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      m2: parsedM2,
      pricePerM2: selectedProduct.pricePerM2,
      commissionRateId: selectedCommissionRate.id,
      commissionRateLabel: selectedCommissionRate.label,
      commissionRatePercent: selectedCommissionRate.percent,
    };
    setItems((current) => [...current, newItem]);
    setSelectedProduct(null);
    setM2(EMPTY);
    setSelectedCommissionRate(null);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  const totals = useMemo(() => calculateOrderTotals(items), [items]);

  const isValid = carpenter !== null && items.length > 0;

  async function submit(onCreated?: (orderId: number) => void) {
    if (!isValid || !carpenter) return;
    setSubmitting(true);
    try {
      const result = await orders.createOrder({
        carpenterId: carpenter.id,
        items: items.map((item) => ({
          productId: item.productId,
          m2: item.m2,
          pricePerM2: item.pricePerM2,
          commissionRatePercent: item.commissionRatePercent,
        })),
      });
      showToast('Pedido salvo!');
      onCreated?.(result.id);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar o pedido.', 'danger');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    carpenter,
    setCarpenter,
    carpenterOptions,
    carpenterLoading,
    carpenterHasMore,
    onCarpenterSearchChange: setCarpenterSearch,
    loadMoreCarpenters,
    hasAnyProduct: loadedProducts.length > 0,
    productOptions,
    productLoading,
    productHasMore: effectiveProductHasMore,
    onProductSearchChange: setProductSearch,
    loadMoreProducts,
    hasAnyCommissionRate: loadedCommissionRates.length > 0,
    commissionRateOptions,
    commissionRateLoading,
    commissionRateHasMore: effectiveCommissionRateHasMore,
    onCommissionRateSearchChange: setCommissionRateSearch,
    loadMoreCommissionRates,
    selectedProduct,
    setSelectedProduct,
    m2,
    setM2,
    selectedCommissionRate,
    setSelectedCommissionRate,
    itemIsValid,
    itemPreview,
    addItem,
    items,
    removeItem,
    totals,
    isValid,
    submitting,
    submit,
    toast,
  };
}
