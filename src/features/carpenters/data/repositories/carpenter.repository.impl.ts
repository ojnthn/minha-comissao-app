import type {
  CarpenterRepository,
  CarpenterListParams,
  CarpenterListResult,
  CarpenterCreateParams,
  CarpenterUpdateParams,
} from '../../domain/repositories/carpenter.repository';
import type { Carpenter } from '../../domain/entities/carpenter.entity';
import type { MarceneiroDto } from '../models/carpenter.dto';
import { createCarpenterHttpDatasource } from '../datasources/carpenter-http.datasource';

function toDomain(dto: MarceneiroDto): Carpenter {
  return { id: dto.id, name: dto.nome };
}

export function createCarpenterRepository(): CarpenterRepository {
  const datasource = createCarpenterHttpDatasource();

  return {
    async list({ page, limit }: CarpenterListParams): Promise<CarpenterListResult> {
      const response = await datasource.list(page, limit);
      return {
        carpenters: response.detalhes.map(toDomain),
        pagination: { current: response.paginacao.atual, next: response.paginacao.proxima },
      };
    },

    async create(params: CarpenterCreateParams): Promise<Carpenter> {
      const dto = await datasource.create({ nome: params.name });
      return toDomain(dto);
    },

    async update(id: number, params: CarpenterUpdateParams): Promise<Carpenter> {
      const dto = await datasource.update(id, { nome: params.name });
      return toDomain(dto);
    },

    remove(id: number): Promise<void> {
      return datasource.remove(id);
    },
  };
}
