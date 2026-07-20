import { httpClient } from '../../../../shared/http/http-client';
import type { ListComissaoPorcentagemResponseDto } from '../models/commission-rate.dto';

export function createCommissionRateHttpDatasource() {
  return {
    list: (page: number, limit: number) =>
      httpClient.get<ListComissaoPorcentagemResponseDto>(`/comissao-porcentagem?page=${page}&limit=${limit}`),
  };
}
