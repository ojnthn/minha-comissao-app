import type { CommissionRate } from '../entities/commission-rate.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';

export interface CommissionRateListParams {
  page: number;
  limit: number;
}

export interface CommissionRateListResult {
  commissionRates: CommissionRate[];
  pagination: OffsetPagination;
}

/** Só leitura — `ComissaoPorcentagem` não tem CRUD exposto no foundation, ver TODO.md. */
export interface CommissionRateRepository {
  list(params: CommissionRateListParams): Promise<CommissionRateListResult>;
}
