import { httpClient } from '../../../../shared/http/http-client';
import type { ListPedidosResponseDto } from '../models/order.dto';

export function createOrderHttpDatasource() {
  return {
    list: (page: number, limit: number) =>
      httpClient.get<ListPedidosResponseDto>(`/pedidos?page=${page}&limit=${limit}`),
  };
}
