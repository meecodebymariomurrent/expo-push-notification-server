import { injectable } from 'inversify';
import { Connection, r, RConnectionOptions } from 'rethinkdb-ts';

@injectable()
export class DatabaseService {

    public connect(): Promise<Connection> {
        return r.connect(this.getDatabaseConfiguration());
    }

    private getDatabaseConfiguration(): RConnectionOptions {
        const host = process.env.DATABASE_HOST;
        const port = parseInt(process.env.DATABASE_PORT);
        return {host, port};
    }
}
