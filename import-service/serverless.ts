import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    lambdaHashingVersion: '20201221',
    region: 'us-east-1',
    profile: 'personalAccount',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      AWS_GENERAL_REGION: 'us-east-1',
      IMPORT_SERVICE_BUCKET: '${self:custom.environment.IMPORT_SERVICE_BUCKET}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
            Resource: 'arn:aws:s3:::${self:custom.environment.IMPORT_SERVICE_BUCKET}/*',
          },
        ],
      },
    },
  },
  functions: { importProductsFile, importFileParser },
  plugins: ['serverless-webpack', 'serverless-offline'],
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    environment: {
      IMPORT_SERVICE_BUCKET: 'book-shop-import-service',
    },
  },
};

module.exports = serverlessConfiguration;
