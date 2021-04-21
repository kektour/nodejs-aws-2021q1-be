import { ValidationError } from 'yup';

export interface UtilsService {
  withCORS(): {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };

  createResponse(
    response: Record<string, any>,
    code?: number
  ): {
    statusCode: number;
    body: string;
  };

  transformYupErrorsToObject(topLevelError: ValidationError): Record<string, string>;
}
