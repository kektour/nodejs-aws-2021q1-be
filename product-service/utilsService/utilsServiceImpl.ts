import { ValidationError } from 'yup';
import { UtilsService } from './utilsService';

export class UtilsServiceImpl implements UtilsService {
  public withCORS() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };
  }

  public createResponse(response: Record<string, any>, code = 200) {
    return {
      statusCode: code,
      body: JSON.stringify(response),
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
