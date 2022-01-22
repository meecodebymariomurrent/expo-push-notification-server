import { injectable } from 'inversify';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import logger from '../utils/logger';
import * as databaseConfiguration from '../config/database-configuration.json';
import * as _ from 'lodash';

@injectable()
export class DatabaseService {

    private connection: Connection;

    public async initialize(): Promise<boolean> {
        try {
            this.connection = await this.connect();
            return new Promise<boolean>((resolve, reject) => {
                r.dbList()
                    .contains(this.getDatabaseName())
                    .do((containsDatabase: RDatum<boolean>) => {
                        return r.branch(
                            containsDatabase,
                            {created: 0},
                            r.dbCreate(this.getDatabaseName())
                        );
                    })
                    .run(this.connection)
                    .then(() => {
                        this.createTables(this.connection)
                            .then(() => {
                                resolve(true);
                            })
                            .catch((error) => {
                                logger.error(error);
                                reject(false);
                            });
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public connect(): Promise<Connection> {
        if (this.connection?.open) {
            return Promise.resolve(this.connection);
        } else {
            return new Promise((resolve, reject) => {
                r.connect(this.getDatabaseConfiguration())
                    .then((connection: Connection) => {
                        resolve(connection);
                    })
                    .catch(() => {
                        reject(false);
                    });
            });
        }
    }

    public disconnect(connection: Connection): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.close()
                    .then(() => {
                        resolve(true);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    public async getById<T>(id: string, table: string): Promise<T> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(table)
                    .get(id)
                    .run(this.connection)
                    .then((response: T) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject();
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async filterBy<T>(filter: unknown, table: string): Promise<Array<T>> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(table)
                    .filter(filter)
                    .run(this.connection)
                    .then((response: Array<T>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject();
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async filterByIds<T>(ids: Array<string>, property: string, table: string): Promise<Array<T>> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(table)
                    .filter(entry => r.expr(ids).contains(entry(property)))
                    .run(this.connection)
                    .then((response: Array<T>) => {
                        resolve(response);
                    }).catch((error) => {
                    logger.error(error);
                    reject();
                });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async getAll<T>(databaseTable: string): Promise<Array<T>> {
        try {
            this.connection = await this.connect();
            return new Promise<Array<T>>((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .filter({})
                    .run(this.connection)
                    .then((response: Array<T>) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        logger.error(`Error while getting all from table ${databaseTable}`, error);
                        reject(error);
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async add<T>(entity: T, databaseTable: string): Promise<T> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .insert(entity)
                    .run(this.connection)
                    .then(() => {
                        resolve(entity);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject();
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async update<T>(id: string, entity: T, databaseTable: string): Promise<T> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                r.db(this.getDatabaseName())
                    .table(databaseTable)
                    .filter({id})
                    .update(entity)
                    .run(this.connection)
                    .then(() => {
                        resolve(entity);
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject();
                    });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public async deleteById(id: string, databaseTable: string): Promise<boolean> {
        try {
            this.connection = await this.connect();
            return new Promise((resolve, reject) => {
                this.connect().then((connection: Connection) => {
                    r.db(this.getDatabaseName())
                        .table(databaseTable)
                        .filter({id})
                        .delete()
                        .run(connection)
                        .then(() => {
                            resolve(true);
                        })
                        .catch((error) => {
                            logger.error(error);
                            reject();
                        });
                });
            });
        } catch (error) {
            logger.error('Error while connecting to the database', error);
            return Promise.reject('An error occurred while initializing the database');
        }
    }

    public getFirstEntry<T>(items: Array<T>): T {
        let item: T = null;
        if (items.length > 0) {
            item = _.head(items);
        }
        return item;
    }

    private createTables(connection: Connection): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const promises = new Array<Promise<boolean>>();
            this.getDatabaseTables().forEach((table) => {
                promises.push(this.createTable(connection, table));
            });
            Promise.all(promises)
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    logger.error(error);
                    reject(false);
                });
        });
    }

    private createTable(connection: Connection, tableName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            r.db(databaseConfiguration.databaseName)
                .tableList()
                .contains(tableName)
                .do((containsTable: RDatum<boolean>) => {
                    return r.branch(
                        containsTable,
                        {create: 0},
                        r.db(databaseConfiguration.databaseName).tableCreate(tableName)
                    );
                })
                .run(connection)
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    logger.error(error);
                    reject(false);
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
