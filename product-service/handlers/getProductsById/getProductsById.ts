import { ProductDAL, ProductDALImpl } from '../../productDAL';
import { Utils, UtilsImpl } from '../../utils';

const productDAL: ProductDAL = new ProductDALImpl();
const utils: Utils = new UtilsImpl();

export const getProductsById = async (event: any) => {
  const { id } = event.pathParameters;
  const product = await productDAL.getProductById(id);

  return {
    ...utils.createSuccessResponse({ product }),
    headers: {
      ...utils.withCORS(),
    },
  };
};
