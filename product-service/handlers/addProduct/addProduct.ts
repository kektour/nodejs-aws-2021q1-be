import { Connection, ConnectionImpl } from '../../db/connection';
import { ProductDAL, ProductDALImpl } from '../../db/productDAL';
import { EnvService, EnvServiceImpl } from '../../envService';
import { UtilsService, UtilsServiceImpl } from '../../utilsService';
import { NewProduct } from './types';
import { validationSchema } from './validationSchema';

const envService: EnvService = new EnvServiceImpl();
const connection: Connection = new ConnectionImpl(envService);
const productDAL: ProductDAL = new ProductDALImpl(connection);
const utilsService: UtilsService = new UtilsServiceImpl();

export const addProduct = async (event: any) => {
  console.info(`Called addProduct ----- ${event.body}`);

  try {
    const body = JSON.parse(event.body);

    try {
      await validationSchema.validate(body, { abortEarly: false });
    } catch (err) {
      const errors = utilsService.transformYupErrorsToObject(err);
      return utilsService.createResponse(errors, 400);
    }
  
    const { title, description, price, count } = <NewProduct>body;
    const newProduct = await productDAL.addProduct(title, price, count, description);
    return utilsService.createResponse(newProduct);
  } catch (err) {
    console.error(err);
    return utilsService.createResponse({ err: 'Unhandled error' }, 500);
  }
};
