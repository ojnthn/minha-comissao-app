import type {
  CommissionRateRepository,
  CommissionRateListParams,
  CommissionRateListResult,
} from '../../domain/repositories/commission-rate.repository';
import type { CommissionRate } from '../../domain/entities/commission-rate.entity';
import type { ComissaoPorcentagemDto } from '../models/commission-rate.dto';
import { createCommissionRateHttpDatasource } from '../datasources/commission-rate-http.datasource';

function toDomain(dto: ComissaoPorcentagemDto): CommissionRate {
  return { id: dto.id, name: dto.descricao, value: dto.valor };
}

export function createCommissionRateRepository(): CommissionRateRepository {
  const datasource = createCommissionRateHttpDatasource();

  return {
    async list({ page, limit }: CommissionRateListParams): Promise<CommissionRateListResult> {
      const response = await datasource.list(page, limit);
      return {
        commissionRates: response.detalhes.map(toDomain),
        pagination: response.pagination,
      };
    },
  };
}
