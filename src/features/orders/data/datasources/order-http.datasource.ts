import { httpClient } from '../../../../shared/http/http-client';
import type { CreatePedidoRequestDto, CreatePedidoResponseDto, ListPedidosResponseDto } from '../models/order.dto';
import type { OrderListParams } from '../../domain/repositories/order.repository';

export function createOrderHttpDatasource() {
  return {
    list: (params: OrderListParams) => {
      const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
      if (params.carpenterId !== undefined) query.set('idMarceneiro', String(params.carpenterId));
      if (params.onlyOwn !== undefined) query.set('porUsuario', String(params.onlyOwn));
      if (params.dateFrom) query.set('dataInicio', params.dateFrom);
      if (params.dateTo) query.set('dataFim', params.dateTo);
      if (params.order) query.set('ordem', params.order);

      return httpClient.get<ListPedidosResponseDto>(`/pedidos?${query.toString()}`);
    },
    create: (body: CreatePedidoRequestDto) => httpClient.post<CreatePedidoResponseDto>('/pedidos', body),
  };
}
