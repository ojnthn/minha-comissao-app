import type { CarpenterRepository } from '../repositories/carpenter.repository';

export function createDeleteCarpenterUseCase(carpenterRepository: CarpenterRepository) {
  return async (id: number): Promise<void> => {
    return carpenterRepository.remove(id);
  };
}
