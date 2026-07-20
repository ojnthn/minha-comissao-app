import type { ProductRepository, ProductUpdateParams } from '../repositories/product.repository';
import type { Product } from '../entities/product.entity';

export function createUpdateProductUseCase(productRepository: ProductRepository) {
  return async (id: number, params: ProductUpdateParams): Promise<Product> => {
    return productRepository.update(id, params);
  };
}
