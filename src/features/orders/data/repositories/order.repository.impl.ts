import type { OrderRepository, OrderListParams, OrderListResult } from '../../domain/repositories/order.repository';
import type { Order } from '../../domain/entities/order.entity';
import type { PedidoDto } from '../models/order.dto';
import { createOrderHttpDatasource } from '../datasources/order-http.datasource';

function toDomain(dto: PedidoDto): Order {
  return {
    id: dto.id,
    code: dto.codigo,
    dateFormatted: dto.data,
    valueFormatted: dto.valor.total,
    commissionFormatted: dto.valor.comissao,
    carpenterId: dto.marceneiro.id,
    carpenterName: dto.marceneiro.nome,
    sellerId: dto.vendedor.id,
    sellerName: dto.vendedor.nome,
    products: dto.produtos.map((produto) => ({
      productId: produto.id,
      productName: produto.nome,
      valueFormatted: produto.valor,
      percentFormatted: produto.porcentagem,
    })),
  };
}

export function createOrderRepository(): OrderRepository {
  const datasource = createOrderHttpDatasource();

  return {
    async list(params: OrderListParams): Promise<OrderListResult> {
      const response = await datasource.list(params);
      return {
        orders: response.detalhes.map(toDomain),
        pagination: response.pagination,
      };
    },
  };
}
