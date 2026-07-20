import { createProductRepository } from './data/repositories/product.repository.impl';
import { createCommissionRateRepository } from './data/repositories/commission-rate.repository.impl';
import { createHasProductsUseCase } from './domain/usecases/has-products.usecase';
import { createListProductsUseCase } from './domain/usecases/list-products.usecase';
import { createCreateProductUseCase } from './domain/usecases/create-product.usecase';
import { createUpdateProductUseCase } from './domain/usecases/update-product.usecase';
import { createDeleteProductUseCase } from './domain/usecases/delete-product.usecase';
import { createListCommissionRatesUseCase } from './domain/usecases/list-commission-rates.usecase';

const productRepository = createProductRepository();
const commissionRateRepository = createCommissionRateRepository();

export const productsContainer = {
  hasProducts: createHasProductsUseCase(productRepository),
  listProducts: createListProductsUseCase(productRepository),
  createProduct: createCreateProductUseCase(productRepository),
  updateProduct: createUpdateProductUseCase(productRepository),
  deleteProduct: createDeleteProductUseCase(productRepository),
  listCommissionRates: createListCommissionRatesUseCase(commissionRateRepository),
};
