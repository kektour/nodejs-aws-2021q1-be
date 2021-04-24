import { ValidationError } from 'yup';
import { Response, UtilsService } from './utilsService';

export class UtilsServiceImpl implements UtilsService {
  public createResponse(response: Record<string, any>, code: number = 200, headers: Record<string, any> = {}): Response {
    return {
      statusCode: code,
      body: JSON.stringify(response),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...headers,
      },
    };
  }

  public transformYupErrorsToObject(topLevelError: ValidationError): Record<string, string> {
    const errors: Record<string, string> = {};

    if (topLevelError.inner.length) {
      topLevelError.inner.forEach((error) => {
        if (!errors[error.path!]) {
          errors[error.path!] = error.message;
        }
      });
    } else {
      errors[topLevelError.path!] = topLevelError.message;
    }

    return errors;
  }
}
