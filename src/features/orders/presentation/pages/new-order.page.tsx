import { useNavigate } from 'react-router-dom';
import {
  Button,
  DataTable,
  PedidoInfoForm,
  PedidoItemForm,
  Toast,
  fontSize,
  fontWeight,
  spacing,
  type DataTableColumn,
} from '@ojnthn/minhas-venda-design-system';
import type { OrderItemDraft } from '../../domain/entities/order.entity';
import type { OrderFormOptionsPort } from '../../domain/repositories/order-form-options.repository';
import { ordersContainer } from '../../orders.container';
import { useOrderForm } from '../hooks/use-order-form.hook';

export interface NewOrderPageProps {
  formOptions: OrderFormOptionsPort;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR');

const TrashIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function NewOrderPage({ formOptions }: NewOrderPageProps) {
  const navigate = useNavigate();
  const {
    carpenter,
    setCarpenter,
    carpenterOptions,
    carpenterLoading,
    carpenterHasMore,
    onCarpenterSearchChange,
    loadMoreCarpenters,
    hasAnyProduct,
    productOptions,
    productLoading,
    productHasMore,
    onProductSearchChange,
    loadMoreProducts,
    hasAnyCommissionRate,
    commissionRateOptions,
    commissionRateLoading,
    commissionRateHasMore,
    onCommissionRateSearchChange,
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
  } = useOrderForm(ordersContainer, formOptions);

  const columns: DataTableColumn<OrderItemDraft>[] = [
    { key: 'productName', header: 'Produto', render: (item) => item.productName },
    { key: 'm2', header: 'm²', render: (item) => `${item.m2} m²`, align: 'right' },
    { key: 'value', header: 'Valor', render: (item) => currencyFormatter.format(item.m2 * item.pricePerM2), align: 'right' },
    { key: 'percent', header: 'Comissão', render: (item) => `${item.commissionRatePercent}%`, align: 'right' },
    {
      key: 'commission',
      header: 'Valor da comissão',
      render: (item) => currencyFormatter.format((item.m2 * item.pricePerM2 * item.commissionRatePercent) / 100),
      align: 'right',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[20] }}>
      <PedidoInfoForm
        marceneiro={carpenter ? { id: String(carpenter.id), nome: carpenter.name } : null}
        onMarceneiroChange={(option) => setCarpenter({ id: Number(option.id), name: option.nome })}
        marceneirosOptions={carpenterOptions.map((option) => ({ id: String(option.id), nome: option.name }))}
        onMarceneirosSearchChange={onCarpenterSearchChange}
        marceneirosLoading={carpenterLoading}
        marceneirosHasMore={carpenterHasMore}
        onLoadMoreMarceneiros={loadMoreCarpenters}
        dataFmt={dateFormatter.format(new Date())}
        valorTotalFmt={currencyFormatter.format(totals.value)}
        comissaoTotalFmt={currencyFormatter.format(totals.commission)}
      />

      <PedidoItemForm
        semProdutos={!productLoading && !hasAnyProduct}
        onGoProdutos={() => navigate('/products')}
        produto={selectedProduct ? { id: String(selectedProduct.id), nome: selectedProduct.name } : null}
        onProdutoChange={(option) => {
          const id = Number(option.id);
          const found = productOptions.find((product) => product.id === id);
          if (found) setSelectedProduct(found);
        }}
        produtosOptions={productOptions.map((option) => ({ id: String(option.id), nome: option.name }))}
        onProdutosSearchChange={onProductSearchChange}
        produtosLoading={productLoading}
        produtosHasMore={productHasMore}
        onLoadMoreProdutos={loadMoreProducts}
        m2={m2}
        onM2Change={setM2}
        percentual={selectedCommissionRate ? { id: String(selectedCommissionRate.id), optionLabel: selectedCommissionRate.label } : null}
        onPercentualChange={(option) => {
          const id = Number(option.id);
          const found = commissionRateOptions.find((rate) => rate.id === id);
          if (found) setSelectedCommissionRate(found);
        }}
        percentuaisOptions={commissionRateOptions.map((option) => ({ id: String(option.id), optionLabel: option.label }))}
        onPercentuaisSearchChange={onCommissionRateSearchChange}
        percentuaisLoading={commissionRateLoading}
        percentuaisHasMore={commissionRateHasMore}
        onLoadMorePercentuais={loadMoreCommissionRates}
        semPercentuaisAviso={!commissionRateLoading && !hasAnyCommissionRate}
        itemValorFmt={currencyFormatter.format(itemPreview.value)}
        itemComissaoFmt={currencyFormatter.format(itemPreview.commission)}
        isValid={itemIsValid}
        onAdd={addItem}
      />

      {toast && <Toast variant={toast.variant === 'danger' ? 'danger' : 'success'}>{toast.message}</Toast>}

      <div>
        <div style={{ fontSize: fontSize[17], fontWeight: fontWeight.bold, marginBottom: spacing[14] }}>
          Produtos deste pedido
        </div>
        <DataTable
          aria-label="Produtos deste pedido"
          columns={columns}
          data={items}
          rowKey={(item) => `${item.productId}-${items.indexOf(item)}`}
          emptyMessage="Nenhum produto adicionado ainda."
          rowActions={(item) => ({
            secondaryActions: [
              { label: 'Excluir', icon: TrashIcon, variant: 'danger', onSelect: () => removeItem(items.indexOf(item)) },
            ],
          })}
        />
      </div>

      <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap' }}>
        <Button size="lg" disabled={!isValid || submitting} onClick={() => submit(() => navigate('/orders'))} style={{ flex: 1, minWidth: '200px' }}>
          Salvar pedido
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/orders')}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
