export interface MarceneiroDto {
  id: number;
  nome: string;
}

/**
 * Endpoint usa chave "paginacao"/"atual"/"proxima" (não "pagination"/"current"/"next"
 * como /produtos) — `proxima` repete `atual` quando não há próxima página, nunca é
 * `null`. Ver `RepeatingPagination` em shared/types/pagination.ts.
 */
export interface ListMarceneirosResponseDto {
  paginacao: { atual: number; proxima: number };
  detalhes: MarceneiroDto[];
}

export interface CreateMarceneiroRequestDto {
  nome: string;
}

export interface UpdateMarceneiroRequestDto {
  nome?: string;
}
