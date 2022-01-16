import winston, { format } from 'winston';

export const expressWinstonConfig = {
    transports: [
        new winston.transports.Console()
    ],
    format: format.combine(
        format.colorize(),
        format.json()
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
        return false;
    }
}
