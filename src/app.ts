import 'reflect-metadata';
import express from 'express';
import { ContainerConfigLoader } from './config/container';
import { ConfigLoader } from './config/env';
import logger from './utils/logger';
import * as expressWinston from 'express-winston';
import { expressWinstonConfig } from './config/express-winston.config';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import './controller';
import path from 'path';

ConfigLoader.load('.env').catch((error: Error) => logger.error(error.message));
const container = ContainerConfigLoader.load();
const server = new InversifyExpressServer(container);

const app = express();
app.use(expressWinston.logger(expressWinstonConfig));

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use('/', express.static(path.join(__dirname, 'public')));
});

const serverInstance = server.build();
const port = parseInt(process.env.PORT) || 3000;

serverInstance.listen(port, () => {
    logger.info(`Expo push notification server is running on port ${port}.`);
});
