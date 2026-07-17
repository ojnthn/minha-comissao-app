export interface PedidoProdutoDto {
  id: number;
  nome: string;
  valor: string;
  porcentagem: string;
}

export interface PedidoDto {
  id: number;
  codigo: string;
  valor: string;
  marceneiro: { id: number; nome: string };
  usuarioCadastro: { id: number; nome: string };
  produtos: PedidoProdutoDto[];
}

export interface ListPedidosResponseDto {
  pagination: { current: number; next: number; total: number };
  data: PedidoDto[];
}
