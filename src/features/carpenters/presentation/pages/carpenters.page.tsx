import {
  Button,
  DataTable,
  MarceneiroForm,
  Toast,
  colors,
  fontSize,
  fontWeight,
  spacing,
  type DataTableColumn,
} from '@ojnthn/minhas-venda-design-system';
import type { Carpenter } from '../../domain/entities/carpenter.entity';
import { carpentersContainer } from '../../carpenters.container';
import { useCarpenters } from '../hooks/use-carpenters.hook';

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

export function CarpentersPage() {
  const {
    carpenters,
    loading,
    error,
    page,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    nome,
    setNome,
    telefone,
    setTelefone,
    searchTerm,
    search,
    isValid,
    isEditing,
    submitting,
    submit,
    startEdit,
    cancelEdit,
    remove,
    toast,
  } = useCarpenters(carpentersContainer);

  const columns: DataTableColumn<Carpenter>[] = [
    { key: 'name', header: 'Nome', render: (carpenter) => carpenter.name },
    { key: 'phone', header: 'Telefone/WhatsApp', render: (carpenter) => carpenter.phone ?? '—' },
  ];

  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[20] }}>
      <MarceneiroForm
        title={isEditing ? 'Editar marceneiro' : 'Adicionar marceneiro'}
        nome={nome}
        onNomeChange={setNome}
        telefone={telefone}
        onTelefoneChange={setTelefone}
        isValid={isValid && !submitting}
        submitLabel={isEditing ? 'Salvar alterações' : 'Adicionar marceneiro'}
        onSubmit={submit}
        isEditing={isEditing}
        onCancel={cancelEdit}
      />

      {toast && <Toast variant={toast.variant === 'danger' ? 'danger' : 'success'}>{toast.message}</Toast>}

      <div>
        <div style={{ fontSize: fontSize[17], fontWeight: fontWeight.bold, marginBottom: spacing[14] }}>
          Marceneiros cadastrados
        </div>

        <DataTable
          aria-label="Marceneiros cadastrados"
          columns={columns}
          data={carpenters}
          rowKey={(carpenter) => String(carpenter.id)}
          isLoading={loading}
          emptyMessage="Nenhum marceneiro cadastrado ainda."
          searchable
          searchValue={searchTerm}
          onSearchChange={search}
          searchPlaceholder="Buscar pelo nome..."
          rowActions={(carpenter) => ({
            primaryAction: { label: 'Editar', icon: EditIcon, onSelect: () => startEdit(carpenter) },
            secondaryActions: [
              { label: 'Excluir', icon: TrashIcon, variant: 'danger', onSelect: () => remove(carpenter) },
            ],
          })}
        />

        {!loading && carpenters.length > 0 && (
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
