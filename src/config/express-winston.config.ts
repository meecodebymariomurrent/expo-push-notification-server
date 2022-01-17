import winston, { format } from 'winston';

export const expressWinstonConfig = {
    transports: [
        new winston.transports.Console()
    ],
    format: format.combine(
        format.label({
            label: '[LOGGER]'
        }),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
        format.colorize(),
        format.json(),
        format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message.trim()}`,
        )
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
        return false;
    }
}
