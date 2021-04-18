export interface Utils {
  withCORS(): {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };

  createSuccessResponse(response: Record<string, any>): {
    statusCode: number;
    body: string;
  };
}
