import type { ProductRepository, ProductListParams, ProductListResult } from '../../domain/repositories/product.repository';
import type { Product } from '../../domain/entities/product.entity';
import type { ProdutoDto } from '../models/product.dto';
import { createProductHttpDatasource } from '../datasources/product-http.datasource';

function toDomain(dto: ProdutoDto): Product {
  return {
    id: dto.id,
    name: dto.nome,
    defaultCommissionRateId: dto.idComissaoPorcentagemPadrao,
  };
}

export function createProductRepository(): ProductRepository {
  const datasource = createProductHttpDatasource();

  return {
    async list({ page, limit }: ProductListParams): Promise<ProductListResult> {
      const response = await datasource.list(page, limit);
      return {
        products: response.details.map(toDomain),
        pagination: response.pagination,
      };
    },
  };
}
