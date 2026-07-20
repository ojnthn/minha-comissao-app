import type { ProductRepository, ProductListParams, ProductListResult } from '../repositories/product.repository';

export function createListProductsUseCase(productRepository: ProductRepository) {
  return async (params: ProductListParams): Promise<ProductListResult> => {
    return productRepository.list(params);
  };
}
