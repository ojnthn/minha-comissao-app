import type {
  CommissionRateRepository,
  CommissionRateListParams,
  CommissionRateListResult,
} from '../repositories/commission-rate.repository';

export function createListCommissionRatesUseCase(commissionRateRepository: CommissionRateRepository) {
  return async (params: CommissionRateListParams): Promise<CommissionRateListResult> => {
    return commissionRateRepository.list(params);
  };
}
