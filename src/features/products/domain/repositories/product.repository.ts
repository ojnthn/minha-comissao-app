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

export interface ProductRepository {
  list(params: ProductListParams): Promise<ProductListResult>;
}
