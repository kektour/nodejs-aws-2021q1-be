import { ProductDALImpl } from '../../db/productDAL';
import { UtilsServiceImpl } from '../../utilsService';
import { getProductsById } from './getProductsById';

describe('getProductsById', () => {
  it('should return found product', async () => {
    const productId = 1;
    const expectedProduct = { id: productId, title: 'Foo', description: 'Bar', price: 123 };
    const event = { pathParameters: { id: productId } };

    const findByIdStub = jest.fn().mockImplementationOnce(() => Promise.resolve(expectedProduct));
    ProductDALImpl.prototype.getProductById = findByIdStub;

    const createSuccessResponseSpy = jest.spyOn(UtilsServiceImpl.prototype, 'createSuccessResponse');
    const withCORSSpy = jest.spyOn(UtilsServiceImpl.prototype, 'withCORS');

    const res = await getProductsById(event);

    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({ product: expectedProduct }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    });
    expect(findByIdStub).toHaveBeenCalledWith(productId);
    expect(createSuccessResponseSpy).toHaveBeenCalled();
    expect(withCORSSpy).toHaveBeenCalled();
  });

  it('should return null if product not found', async () => {
    const event = { pathParameters: { id: 1 } };

    const findByIdStub = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
    ProductDALImpl.prototype.getProductById = findByIdStub;

    const res = await getProductsById(event);

    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({ product: null }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    });
  });
});
