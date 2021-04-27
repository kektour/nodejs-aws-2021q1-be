export interface ProductBase {
  id: string;
  title: string;
  description: string | null;
  price: number;
}

export interface Product extends ProductBase {
  count: number;
}

export interface ProductDAL {
  getAllProducts(): Promise<Array<Product>>;
  getProductById(id: string): Promise<Product | null>;
  addProduct(title: string, price: number, count: number, description?: string): Promise<Product>;
}
