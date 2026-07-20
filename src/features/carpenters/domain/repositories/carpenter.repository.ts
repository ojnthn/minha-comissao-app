import type { Carpenter } from '../entities/carpenter.entity';
import type { RepeatingPagination } from '../../../../shared/types/pagination';

export interface CarpenterListParams {
  page: number;
  limit: number;
  nome?: string;
}

export interface CarpenterListResult {
  carpenters: Carpenter[];
  pagination: RepeatingPagination;
}

export interface CarpenterCreateParams {
  name: string;
  phone?: string;
}

export interface CarpenterUpdateParams {
  name?: string;
  phone?: string;
}

export interface CarpenterRepository {
  list(params: CarpenterListParams): Promise<CarpenterListResult>;
  create(params: CarpenterCreateParams): Promise<Carpenter>;
  update(id: number, params: CarpenterUpdateParams): Promise<Carpenter>;
  remove(id: number): Promise<void>;
}
