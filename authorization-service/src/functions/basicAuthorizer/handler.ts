import { Effect, generatePolicy } from '@libs/generatePolicy';
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _, cb) => {
  console.log('Event: ', event);

  if (event.type !== 'TOKEN') {
    return cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;

    const [, encodedCreds] = authorizationToken.split(' ');
    const buff = Buffer.from(encodedCreds, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? Effect.Deny : Effect.Allow;

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (err) {
    cb(`Unauthorized: ${err.message}`);
  }
};

export const main = basicAuthorizer;
