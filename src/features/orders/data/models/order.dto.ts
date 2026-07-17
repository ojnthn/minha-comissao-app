export interface PedidoProdutoDto {
  id: number;
  nome: string;
  valor: string;
  porcentagem: string;
}

export interface PedidoValorDto {
  total: string;
  comissao: string;
}

export interface PedidoDto {
  id: number;
  codigo: string;
  data: string;
  marceneiro: { id: number; nome: string };
  vendedor: { id: number; nome: string };
  valor: PedidoValorDto;
  produtos: PedidoProdutoDto[];
}

export interface ListPedidosResponseDto {
  pagination: { current: number; next: number | null };
  detalhes: PedidoDto[];
}
