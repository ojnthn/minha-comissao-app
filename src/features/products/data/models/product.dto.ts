export interface ProdutoDto {
  id: number;
  nome: string;
  valorPorM2: number;
  idComissaoPorcentagemPadrao: number;
}

/** Endpoint usa a chave "details", não "data" (ver ARCHITECTURE.md seção 5) — não abstrair como se fosse igual a /pedidos. */
export interface ListProdutosResponseDto {
  pagination: { current: number; next: number | null };
  details: ProdutoDto[];
}

export interface CreateProdutoRequestDto {
  nome: string;
  valorPorM2: number;
  idComissaoPorcentagemPadrao: number;
}

export interface UpdateProdutoRequestDto {
  nome?: string;
  valorPorM2?: number;
  idComissaoPorcentagemPadrao?: number;
}
