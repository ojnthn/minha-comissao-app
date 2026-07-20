import { httpClient } from '../../../../shared/http/http-client';
import type {
  CreateMarceneiroRequestDto,
  ListMarceneirosResponseDto,
  MarceneiroDto,
  UpdateMarceneiroRequestDto,
} from '../models/carpenter.dto';

export function createCarpenterHttpDatasource() {
  return {
    list: (page: number, limit: number) =>
      httpClient.get<ListMarceneirosResponseDto>(`/marceneiro?page=${page}&limit=${limit}`),
    search: (nome: string, page: number, limit: number) =>
      httpClient.get<ListMarceneirosResponseDto>(
        `/marceneiro/${encodeURIComponent(nome)}?page=${page}&limit=${limit}`,
      ),
    create: (body: CreateMarceneiroRequestDto) => httpClient.post<MarceneiroDto>('/marceneiro', body),
    update: (id: number, body: UpdateMarceneiroRequestDto) => httpClient.patch<MarceneiroDto>(`/marceneiro/${id}`, body),
    remove: (id: number) => httpClient.delete<void>(`/marceneiro/${id}`),
  };
}
