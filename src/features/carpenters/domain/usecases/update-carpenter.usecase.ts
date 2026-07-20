import type { CarpenterRepository, CarpenterUpdateParams } from '../repositories/carpenter.repository';
import type { Carpenter } from '../entities/carpenter.entity';

export function createUpdateCarpenterUseCase(carpenterRepository: CarpenterRepository) {
  return async (id: number, params: CarpenterUpdateParams): Promise<Carpenter> => {
    return carpenterRepository.update(id, params);
  };
}
