import {
  Button,
  DataTable,
  ProdutoForm,
  Toast,
  colors,
  fontSize,
  fontWeight,
  spacing,
  type DataTableColumn,
} from '@ojnthn/minhas-venda-design-system';
import type { Product } from '../../domain/entities/product.entity';
import { productsContainer } from '../../products.container';
import { useProducts } from '../hooks/use-products.hook';

const EditIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

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

export function ProductsPage() {
  const {
    products,
    loading,
    error,
    page,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    commissionRateOptions,
    commissionRateNameById,
    commissionRateLoading,
    commissionRateHasMore,
    onCommissionRateSearchChange,
    loadMoreCommissionRates,
    hasAnyCommissionRate,
    nome,
    setNome,
    valorPorM2,
    setValorPorM2,
    searchTerm,
    search,
    selectedCommissionRate,
    setSelectedCommissionRate,
    isValid,
    isEditing,
    submitting,
    submit,
    startEdit,
    cancelEdit,
    remove,
    toast,
  } = useProducts(productsContainer);

  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const columns: DataTableColumn<Product>[] = [
    { key: 'name', header: 'Nome da chapa', render: (product) => product.name },
    {
      key: 'pricePerM2',
      header: 'Valor do m²',
      render: (product) => currencyFormatter.format(product.pricePerM2),
    },
    {
      key: 'commission',
      header: 'Comissão padrão',
      render: (product) => commissionRateNameById.get(product.defaultCommissionRateId) ?? '—',
    },
  ];

  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[20] }}>
      <ProdutoForm
        title={isEditing ? 'Editar chapa' : 'Adicionar chapa'}
        nome={nome}
        onNomeChange={setNome}
        valorPorM2={valorPorM2}
        onValorPorM2Change={setValorPorM2}
        percentualComissao={
          selectedCommissionRate
            ? { id: String(selectedCommissionRate.id), optionLabel: selectedCommissionRate.name }
            : null
        }
        onPercentualChange={(option) => {
          const id = Number(option.id);
          const known = commissionRateOptions.find((rate) => rate.id === id);
          setSelectedCommissionRate({ id, name: option.optionLabel, value: known?.value ?? 0 });
        }}
        percentuaisOptions={commissionRateOptions.map((rate) => ({ id: String(rate.id), optionLabel: rate.name }))}
        onPercentuaisSearchChange={onCommissionRateSearchChange}
        percentuaisLoading={commissionRateLoading}
        percentuaisHasMore={commissionRateHasMore}
        onLoadMorePercentuais={loadMoreCommissionRates}
        semPercentuaisAviso={!commissionRateLoading && !hasAnyCommissionRate}
        isValid={isValid && !submitting}
        submitLabel={isEditing ? 'Salvar alterações' : 'Adicionar chapa'}
        onSubmit={submit}
        isEditing={isEditing}
        onCancel={cancelEdit}
      />

      {toast && (
        <Toast variant={toast.variant === 'danger' ? 'danger' : 'success'}>{toast.message}</Toast>
      )}

      <div>
        <div style={{ fontSize: fontSize[17], fontWeight: fontWeight.bold, marginBottom: spacing[14] }}>
          Chapas cadastradas
        </div>

        <DataTable
          aria-label="Chapas cadastradas"
          columns={columns}
          data={products}
          rowKey={(product) => String(product.id)}
          isLoading={loading}
          emptyMessage="Nenhuma chapa cadastrada ainda."
          searchable
          searchValue={searchTerm}
          onSearchChange={search}
          searchPlaceholder="Buscar pelo nome..."
          rowActions={(product) => ({
            primaryAction: { label: 'Editar', icon: EditIcon, onSelect: () => startEdit(product) },
            secondaryActions: [
              { label: 'Excluir', icon: TrashIcon, variant: 'danger', onSelect: () => remove(product) },
            ],
          })}
        />

        {!loading && products.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[12], marginTop: spacing[16] }}>
            <span style={{ fontSize: fontSize[14], fontWeight: fontWeight.bold, color: colors.text.dim }}>
              Página {page}
            </span>
            <Button variant="secondary" size="md" disabled={!hasPreviousPage} onClick={goToPreviousPage}>
              Anterior
            </Button>
            <Button variant="secondary" size="md" disabled={!hasNextPage} onClick={goToNextPage}>
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
