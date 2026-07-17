import type { ProductRepository } from '../repositories/product.repository';

export function createHasProductsUseCase(productRepository: ProductRepository) {
  return async (): Promise<boolean> => {
    const { products } = await productRepository.list({ page: 1, limit: 1 });
    return products.length > 0;
  };
}
