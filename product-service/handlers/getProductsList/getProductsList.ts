import { Connection, ConnectionImpl } from '../../db/connection';
import { ProductDAL, ProductDALImpl } from '../../db/productDAL';
import { EnvService, EnvServiceImpl } from '../../envService';
import { UtilsService, UtilsServiceImpl } from '../../utilsService';

const envService: EnvService = new EnvServiceImpl();
const connection: Connection = new ConnectionImpl(envService);
const productDAL: ProductDAL = new ProductDALImpl(connection);
const utilsService: UtilsService = new UtilsServiceImpl();

export const getProductsList = async () => {
  console.info('Called getProductsList');

  try {
    const products = await productDAL.getAllProducts();
    return utilsService.createResponse({
      products,
      meta: { count: products.length },
    });
  } catch (err) {
    console.error(err);
    return utilsService.createResponse({ err: 'Unhandled error' }, 500);
  }
};
