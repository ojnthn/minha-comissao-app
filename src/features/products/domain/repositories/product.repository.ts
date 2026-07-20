import type { Product } from '../entities/product.entity';
import type { OffsetPagination } from '../../../../shared/types/pagination';

export interface ProductListParams {
  page: number;
  limit: number;
}

export interface ProductListResult {
  products: Product[];
  pagination: OffsetPagination;
}

export interface ProductCreateParams {
  name: string;
  defaultCommissionRateId: number;
}

export interface ProductUpdateParams {
  name?: string;
  defaultCommissionRateId?: number;
}

export interface ProductRepository {
  list(params: ProductListParams): Promise<ProductListResult>;
  create(params: ProductCreateParams): Promise<Product>;
  update(id: number, params: ProductUpdateParams): Promise<Product>;
  remove(id: number): Promise<void>;
}
