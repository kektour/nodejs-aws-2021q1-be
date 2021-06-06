import * as AWS from 'aws-sdk';
import { Connection, ConnectionImpl } from '../../db/connection';
import { Product, ProductDAL, ProductDALImpl } from '../../db/productDAL';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { SQSBody } from './types';

const envService: EnvService = new EnvServiceImpl();
const connection: Connection = new ConnectionImpl(envService);
const productDAL: ProductDAL = new ProductDALImpl(connection);

let productsPromises: Array<Promise<Product>> = [];
let isFinished = false;

export const catalogBatchProcess = async (event: any) => {
  event.Records.forEach((record: any) => {
    const { meta, product }: SQSBody = JSON.parse(record.body);
    if (meta.isFinished) {
      isFinished = true;
      return;
    }

    productsPromises.push(productDAL.addProduct(product.title, product.price, product.count, product.description));
  });

  if (!isFinished) {
    return;
  }

  const sns = new AWS.SNS();
  const products = await Promise.all(productsPromises);
  console.log(products.length);

  productsPromises = [];
  isFinished = false;

  await sns.publish({
    Subject: 'Products uploaded',
    Message: JSON.stringify(products),
    TopicArn: envService.getVar('SNS_ARN'),
  }).promise();
  console.log('Email was sent');
};
