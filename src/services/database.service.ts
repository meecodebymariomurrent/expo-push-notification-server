import { injectable } from 'inversify';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import logger from '../utils/logger';
import * as databaseConfiguration from '../config/database-configuration.json';
import * as _ from 'lodash';

@injectable()
export class DatabaseService {

    public initialize(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.dbCreate('wedding-app').run(connection).then(() => {
                    this.creatTables(connection).then(() => {
                        logger.info('Tables created');
                        resolve(true);
                    });
                }).catch(() => {
                    logger.info('Database already exists');
                    this.creatTables(connection).then(() => {
                        logger.info('Tables created');
                        resolve(true);
                    });
                });
            }).catch((error) => {
                logger.error('Error while connecting to the database');
                reject(error);
            });
        });
    }

    public connect(): Promise<Connection | boolean> {
        return new Promise((resolve, reject) => {
            r.connect(this.getDatabaseConfiguration()).then((connection: Connection) => {
                resolve(connection);
            }).catch(() => {
                reject(false);
            });
        });
    }

    public disconnect(connection: Connection): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.close().then(() => {
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    public getById<T>(id: string, table: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(table)
                    .get(id)
                    .run(connection).then((response: T) => {
                    resolve(response);
                }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public filterBy<T>(filter: any, table: string): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(table)
                    .filter(filter)
                    .run(connection).then((response: Array<T>) => {
                    resolve(response);
                }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public getAll<T>(databaseTable: string): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .filter({})
                    .run(connection)
                    .then((response: Array<T>) => {
                        resolve(response);
                    }).catch((error) => {
                    logger.error(`Error while getting all from table ${databaseTable}`, error);
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public add<T>(entity: T, databaseTable: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .insert(entity)
                    .run(connection).then(() => {
                    resolve(entity);
                }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public update<T>(id: string, entity: T, databaseTable: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .filter({id})
                    .update(entity)
                    .run(connection).then(() => {
                    resolve(entity);
                }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public deleteById(id: string, databaseTable: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connect().then((connection: Connection) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .filter({id})
                    .delete()
                    .run(connection).then(() => {
                    resolve(true);
                }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            }).catch((error) => {
                logger.error('Error while obtaining connection');
                reject(error);
            });
        });
    }

    public getFirstEntry<T>(items: Array<T>): T {
        let item: T = null;
        if (items.length > 0) {
            item = _.head(items);
        }
        return item;
    }

    private creatTables(connection: Connection): Promise<boolean> {
        return new Promise((resolve) => {
            const promises = new Array<Promise<boolean>>();
            this.getDatabaseTables().forEach((table) => {
                promises.push(this.createTable(connection, table));
            });
            Promise.all(promises).then(() => {
                resolve(true);
            }).catch(() => {
                logger.error(`Error while creating tables`);
                resolve(false);
            });
        });
    }

    private createTable(connection: Connection, table: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            r.db(this.getDatabaseName())
                .tableList()
                .contains(table)
                .do((containsTable: RDatum<boolean>) => {
                    return r.branch(containsTable, {created: 0}, r.tableCreate(table));
                })
                .run(connection)
                .then(resolve)
                .catch((error) => {
                    logger.error(error);
                    reject(error);
                });
        });
    }

    private getDatabaseConfiguration(): RConnectionOptions {
        const host = process.env.DATABASE_HOST;
        const port = parseInt(process.env.DATABASE_PORT);
        return {host, port};
    }

    private getDatabaseName(): string {
        return databaseConfiguration?.databaseName || 'sample-db';
    }

    private getDatabaseTables(): Array<string> {
        return databaseConfiguration?.tables || new Array<string>();
    }
}
