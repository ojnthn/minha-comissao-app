import type { CarpenterRepository, CarpenterCreateParams } from '../repositories/carpenter.repository';
import type { Carpenter } from '../entities/carpenter.entity';

export function createCreateCarpenterUseCase(carpenterRepository: CarpenterRepository) {
  return async (params: CarpenterCreateParams): Promise<Carpenter> => {
    return carpenterRepository.create(params);
  };
}
