import { createCarpenterRepository } from './data/repositories/carpenter.repository.impl';
import { createListCarpentersUseCase } from './domain/usecases/list-carpenters.usecase';
import { createCreateCarpenterUseCase } from './domain/usecases/create-carpenter.usecase';
import { createUpdateCarpenterUseCase } from './domain/usecases/update-carpenter.usecase';
import { createDeleteCarpenterUseCase } from './domain/usecases/delete-carpenter.usecase';

const carpenterRepository = createCarpenterRepository();

export const carpentersContainer = {
  listCarpenters: createListCarpentersUseCase(carpenterRepository),
  createCarpenter: createCreateCarpenterUseCase(carpenterRepository),
  updateCarpenter: createUpdateCarpenterUseCase(carpenterRepository),
  deleteCarpenter: createDeleteCarpenterUseCase(carpenterRepository),
};
