import { httpClient } from '../../../../shared/http/http-client';
import type { CreateProdutoRequestDto, ListProdutosResponseDto, ProdutoDto, UpdateProdutoRequestDto } from '../models/product.dto';

export function createProductHttpDatasource() {
  return {
    list: (page: number, limit: number) =>
      httpClient.get<ListProdutosResponseDto>(`/produtos?page=${page}&limit=${limit}`),
    create: (body: CreateProdutoRequestDto) => httpClient.post<ProdutoDto>('/produtos', body),
    update: (id: number, body: UpdateProdutoRequestDto) => httpClient.patch<ProdutoDto>(`/produtos/${id}`, body),
    remove: (id: number) => httpClient.delete<void>(`/produtos/${id}`),
  };
}
