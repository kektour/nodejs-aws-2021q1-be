import { Connection } from '../connection';
import { Product, ProductBase, ProductDAL } from './productDAL';

export class ProductDALImpl implements ProductDAL {
  private _productsWithCountQueryStr = 'select p.id, p.title, p.description, p.price, s.count from product p inner join stock s on s.product_id = p.id';

  constructor(private readonly _connection: Connection) {}

  public async getAllProducts(): Promise<Array<Product>> {
    const connection = await this._connection.connect();
    const { rows } = await connection.query<Product>(this._productsWithCountQueryStr);
    await connection.end();
    return rows;
  }

  public async getProductById(id: string): Promise<Product | null> {
    const connection = await this._connection.connect();

    try {
      const { rows } = await connection.query<Product>(`${this._productsWithCountQueryStr} where p.id = $1`, [id]);
      await connection.end();

      if (rows.length > 0) {
        return rows[0];
      }
    } catch (err) {
      console.error(err);
      await connection.end();
    }

    return null;
  }

  public async addProduct(title: string, price: number, count: number, description?: string): Promise<Product> {
    const connection = await this._connection.connect();

    await connection.query('BEGIN');

    try {
      const { rows: [product] } = await connection.query<ProductBase>('insert into product (title, description, price) values ($1, $2, $3) returning *', [title, description, price]);
      await connection.query('insert into stock (product_id, count) values ($1, $2)', [product.id, count]);
      await connection.query('COMMIT');

      return {
        ...product,
        count,
      };
    } catch (err) {
      await connection.query('ROLLBACK');
      throw err;
    }
  }
}
