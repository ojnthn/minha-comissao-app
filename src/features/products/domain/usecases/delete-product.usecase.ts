import type { ProductRepository } from '../repositories/product.repository';

export function createDeleteProductUseCase(productRepository: ProductRepository) {
  return async (id: number): Promise<void> => {
    return productRepository.remove(id);
  };
}
