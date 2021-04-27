import { ValidationError } from 'yup';

export interface Response {
  statusCode: number;
  body: string;
  headers: Record<string, any>;
}

export interface UtilsService {
  createResponse(response: Record<string, any>, code?: number, headers?: Record<string, any>): Response;
  transformYupErrorsToObject(topLevelError: ValidationError): Record<string, string>;
}
