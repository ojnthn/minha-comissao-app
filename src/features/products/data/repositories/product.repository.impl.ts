import type {
  ProductRepository,
  ProductListParams,
  ProductListResult,
  ProductCreateParams,
  ProductUpdateParams,
} from '../../domain/repositories/product.repository';
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

    async create(params: ProductCreateParams): Promise<Product> {
      const dto = await datasource.create({
        nome: params.name,
        idComissaoPorcentagemPadrao: params.defaultCommissionRateId,
      });
      return toDomain(dto);
    },

    async update(id: number, params: ProductUpdateParams): Promise<Product> {
      const dto = await datasource.update(id, {
        nome: params.name,
        idComissaoPorcentagemPadrao: params.defaultCommissionRateId,
      });
      return toDomain(dto);
    },

    remove(id: number): Promise<void> {
      return datasource.remove(id);
    },
  };
}
