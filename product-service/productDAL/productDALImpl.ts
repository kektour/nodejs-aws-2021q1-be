import { Product, ProductDAL } from './productDAL';

export class ProductDALImpl implements ProductDAL {
  private _products: Array<Product> = [
    { id: '1', title: 'Book 1', description: 'Description 1', price: 49 },
    { id: '2', title: 'Book 2', description: 'Description 2', price: 28 },
    { id: '3', title: 'Book 3', description: 'Description 3', price: 21 },
    { id: '4', title: 'Book 4', description: 'Description 4', price: 7 },
    { id: '5', title: 'Book 5', description: 'Description 5', price: 17 },
  ];

  getProducts() {
    return Promise.resolve(this._products);
  }

  getProductById(id: string) {
    return Promise.resolve(this._products.find((product) => product.id === id) || null);
  }
}
