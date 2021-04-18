import { Utils } from './utils';

export class UtilsImpl implements Utils {
  withCORS() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };
  }

  createSuccessResponse(response: Record<string, any>) {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }
}
