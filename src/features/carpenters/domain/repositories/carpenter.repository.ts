import type { Carpenter } from '../entities/carpenter.entity';
import type { RepeatingPagination } from '../../../../shared/types/pagination';

export interface CarpenterListParams {
  page: number;
  limit: number;
}

export interface CarpenterListResult {
  carpenters: Carpenter[];
  pagination: RepeatingPagination;
}

export interface CarpenterCreateParams {
  name: string;
}

export interface CarpenterUpdateParams {
  name?: string;
}

export interface CarpenterRepository {
  list(params: CarpenterListParams): Promise<CarpenterListResult>;
  create(params: CarpenterCreateParams): Promise<Carpenter>;
  update(id: number, params: CarpenterUpdateParams): Promise<Carpenter>;
  remove(id: number): Promise<void>;
}
