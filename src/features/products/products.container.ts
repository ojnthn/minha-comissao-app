import { createProductRepository } from './data/repositories/product.repository.impl';
import { createHasProductsUseCase } from './domain/usecases/has-products.usecase';

const productRepository = createProductRepository();

export const productsContainer = {
  hasProducts: createHasProductsUseCase(productRepository),
};
