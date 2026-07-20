import type { CarpenterRepository, CarpenterListParams, CarpenterListResult } from '../repositories/carpenter.repository';

export function createListCarpentersUseCase(carpenterRepository: CarpenterRepository) {
  return async (params: CarpenterListParams): Promise<CarpenterListResult> => {
    return carpenterRepository.list(params);
  };
}
