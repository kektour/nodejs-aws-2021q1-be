export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface ProductDAL {
  getProducts(): Promise<Array<Product>>;
  getProductById(id: string): Promise<Product | null>;
}
