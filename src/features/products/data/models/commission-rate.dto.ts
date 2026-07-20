export interface ComissaoPorcentagemDto {
  id: number;
  descricao: string;
  valor: number;
}

/** Endpoint usa a chave "detalhes" — igual /pedidos, diferente de /produtos ("details"). */
export interface ListComissaoPorcentagemResponseDto {
  pagination: { current: number; next: number | null };
  detalhes: ComissaoPorcentagemDto[];
}
