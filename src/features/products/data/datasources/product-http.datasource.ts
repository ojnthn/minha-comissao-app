import { httpClient } from '../../../../shared/http/http-client';
import type { ListProdutosResponseDto } from '../models/product.dto';

export function createProductHttpDatasource() {
  return {
    list: (page: number, limit: number) =>
      httpClient.get<ListProdutosResponseDto>(`/produtos?page=${page}&limit=${limit}`),
  };
}
