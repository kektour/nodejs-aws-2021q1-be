import { ProductDAL, ProductDALImpl } from '../../productDAL';
import { Utils, UtilsImpl } from '../../utils';

const productDAL: ProductDAL = new ProductDALImpl();
const utils: Utils = new UtilsImpl();

export const getProductsList = async () => {
  const products = await productDAL.getProducts();

  return {
    ...utils.createSuccessResponse({
      products,
      meta: {
        count: products.length,
      },
    }),
    headers: {
      ...utils.withCORS(),
    },
  };
};
