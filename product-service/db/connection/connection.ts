import { Client } from 'pg';

export interface Connection {
  connect(): Promise<Client>;
}
