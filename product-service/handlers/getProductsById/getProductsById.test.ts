import { ProductDALImpl } from '../../db/productDAL';
import { UtilsServiceImpl } from '../../services/utilsService';
import { getProductsById } from './getProductsById';

jest.mock('../../services/envService/envServiceImpl', () => {
  const { EnvServiceImpl: mockRealServiceImpl } = jest.requireActual('../../services/envService/envServiceImpl');

  mockRealServiceImpl.prototype.getVar = (val: string) => val;

  return { EnvServiceImpl: mockRealServiceImpl };
});

describe('getProductsById', () => {
  it('should return found product', async () => {
    const productId = 1;
    const expectedProduct = { id: productId, title: 'Foo', description: 'Bar', price: 123 };
    const event = { pathParameters: { id: productId } };

    const findByIdStub = jest.fn().mockResolvedValueOnce(expectedProduct);
    ProductDALImpl.prototype.getProductById = findByIdStub;

    const createResponseSpy = jest.spyOn(UtilsServiceImpl.prototype, 'createResponse');

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
    expect(createResponseSpy).toHaveBeenCalled();
  });

  it('should return null if product not found', async () => {
    const event = { pathParameters: { id: 1 } };

    const findByIdStub = jest.fn().mockResolvedValueOnce(null);
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
