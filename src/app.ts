import 'reflect-metadata';
import express from 'express';
import { ContainerConfigLoader } from './config/container';
import { ConfigLoader } from './config/env';
import logger from './utils/logger';
import * as expressWinston from 'express-winston';
import { expressWinstonConfig } from './config/express-winston.config';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import path from 'path';
import { DatabaseService } from './services/database.service';
import './controller';
import helmet from 'helmet';
import cors from 'cors';

ConfigLoader.load('.env').catch((error: Error) => logger.error(error.message));
const container = ContainerConfigLoader.load();
const databaseService = container.get<DatabaseService>(DatabaseService.name);
databaseService.initialize().then(() => initializeServer()).catch((error) => {
    logger.error(error);
});

const initializeServer = () => {
    logger.info('Initializing server');
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(expressWinston.logger(expressWinstonConfig));
        app.use('/', express.static(path.join(__dirname, 'public')));
        app.use(helmet());
        app.use(cors());
    });

    const serverInstance = server.build();
    const port = parseInt(process.env.PORT) || 3000;

    serverInstance.listen(port, () => {
        logger.info(`Expo push notification server is running on port ${port}.`);
    });
}
