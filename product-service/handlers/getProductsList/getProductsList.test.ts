import { ProductDALImpl, Product } from '../../db/productDAL';
import { UtilsServiceImpl } from '../../utilsService';
import { getProductsList } from './getProductsList';

describe('getProductsList', () => {
  const products: Array<Product> = [{ id: '1', title: 'Foo', description: 'Bar', price: 123 }];

  it('should return found product', async () => {
    const getProductsStub = jest.fn().mockImplementationOnce(() => Promise.resolve(products));
    ProductDALImpl.prototype.getAllProducts = getProductsStub;

    const createSuccessResponseSpy = jest.spyOn(UtilsServiceImpl.prototype, 'createSuccessResponse');
    const withCORSSpy = jest.spyOn(UtilsServiceImpl.prototype, 'withCORS');

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
    expect(createSuccessResponseSpy).toHaveBeenCalled();
    expect(withCORSSpy).toHaveBeenCalled();
  });
});
