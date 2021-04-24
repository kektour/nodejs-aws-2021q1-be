import { Connection, ConnectionImpl } from '../../db/connection';
import { ProductDAL, ProductDALImpl } from '../../db/productDAL';
import { EnvService, EnvServiceImpl } from '../../envService';
import { UtilsService, UtilsServiceImpl } from '../../utilsService';

const envService: EnvService = new EnvServiceImpl();
const connection: Connection = new ConnectionImpl(envService);
const productDAL: ProductDAL = new ProductDALImpl(connection);
const utilsService: UtilsService = new UtilsServiceImpl();

export const getProductsById = async (event: any) => {
  console.info(`Called getProductsById ----- ${JSON.stringify(event.pathParameters)}`);
  
  try {
    const { id } = event.pathParameters;
    const product = await productDAL.getProductById(id);

    return utilsService.createResponse({ product });
  } catch (err) {
    console.error(err);
    return utilsService.createResponse({ err: 'Unhandled error' }, 500);
  }
};
