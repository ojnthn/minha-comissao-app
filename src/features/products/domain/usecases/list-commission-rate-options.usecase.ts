import type { CommissionRateRepository } from '../repositories/commission-rate.repository';
import type { CommissionRate } from '../entities/commission-rate.entity';

export function createListCommissionRateOptionsUseCase(commissionRateRepository: CommissionRateRepository) {
  return async (): Promise<CommissionRate[]> => {
    const result = await commissionRateRepository.list({ page: 1, limit: 100 });
    return result.commissionRates;
  };
}
