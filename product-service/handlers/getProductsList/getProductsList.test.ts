import { ProductDALImpl, Product } from '../../productDAL';
import { UtilsImpl } from '../../utils';
import { getProductsList } from './getProductsList';

describe('getProductsList', () => {
  const products: Array<Product> = [{ id: '1', title: 'Foo', description: 'Bar', price: 123 }];

  it('should return found product', async () => {
    const getProductsStub = jest.fn().mockImplementationOnce(() => Promise.resolve(products));
    ProductDALImpl.prototype.getProducts = getProductsStub;

    const createSuccessResponseSpy = jest.spyOn(UtilsImpl.prototype, 'createSuccessResponse');
    const withCORSSpy = jest.spyOn(UtilsImpl.prototype, 'withCORS');

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
