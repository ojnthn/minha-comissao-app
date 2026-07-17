export interface ProdutoDto {
  id: number;
  nome: string;
  idComissaoPorcentagemPadrao: number;
}

/** Endpoint usa a chave "details", não "data" (ver ARCHITECTURE.md seção 5) — não abstrair como se fosse igual a /pedidos. */
export interface ListProdutosResponseDto {
  pagination: { current: number; next: number | null };
  details: ProdutoDto[];
}
