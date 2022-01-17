import { format, transports, addColors, createLogger } from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'gray',
    debug: 'blue',
    silly: 'grey'
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

addColors(colors);

const winstonFormat = format.combine(
    format.colorize({
        all: true
    }),
    format.label({
        label: '[LOGGER]'
    }),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    format.align(),
    format.colorize(),
    format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message.trim()}`,
    )
)

const winstonLogger = createLogger({
    level: level(),
    levels,
    format: winstonFormat,
    transports: [
        new transports.Console()
    ],
});

export default winstonLogger;
