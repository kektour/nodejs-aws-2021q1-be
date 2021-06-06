import { NewProduct } from '../addProduct/types';

export interface SQSBody {
  meta: {
    isFinished?: boolean;
  };
  product: NewProduct;
}
