import { Client, ClientConfig } from 'pg';
import { EnvService } from '../../envService';
import { Connection } from './connection';

export class ConnectionImpl implements Connection {
  private _clientConfig: ClientConfig;

  constructor(private readonly _envService: EnvService) {
    this._clientConfig = {
      host: this._envService.getVar('PG_HOST'),
      port: Number(this._envService.getVar('PG_PORT')),
      database: this._envService.getVar('PG_DB'),
      user: this._envService.getVar('PG_USERNAME'),
      password: this._envService.getVar('PG_PASSWORD'),
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
    };
  }

  public async connect(): Promise<Client> {
    const client = new Client(this._clientConfig);
    await client.connect();

    return client;
  }
}
