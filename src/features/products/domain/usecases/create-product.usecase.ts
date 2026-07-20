import type { ProductRepository, ProductCreateParams } from '../repositories/product.repository';
import type { Product } from '../entities/product.entity';

export function createCreateProductUseCase(productRepository: ProductRepository) {
  return async (params: ProductCreateParams): Promise<Product> => {
    return productRepository.create(params);
  };
}
