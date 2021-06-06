import { ProductDALImpl, Product } from '../../db/productDAL';
import { UtilsServiceImpl } from '../../services/utilsService';
import { getProductsList } from './getProductsList';

jest.mock('../../services/envService/envServiceImpl', () => {
  const { EnvServiceImpl: mockRealServiceImpl } = jest.requireActual('../../services/envService/envServiceImpl');

  mockRealServiceImpl.prototype.getVar = (val: string) => val;

  return { EnvServiceImpl: mockRealServiceImpl };
});

describe('getProductsList', () => {
  const products: Array<Product> = [{ id: '1', title: 'Foo', description: 'Bar', price: 123, count: 1 }];

  it('should return found product', async () => {
    const getProductsStub = jest.fn().mockResolvedValueOnce(products);
    ProductDALImpl.prototype.getAllProducts = getProductsStub;

    const createResponseSpy = jest.spyOn(UtilsServiceImpl.prototype, 'createResponse');

    const res = await getProductsList();

    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        products,
        meta: {
          count: products.length,
        },
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    });
    expect(getProductsStub).toHaveBeenCalled();
    expect(createResponseSpy).toHaveBeenCalled();
  });
});
