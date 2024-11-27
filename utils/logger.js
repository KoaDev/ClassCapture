const winston = require('winston');
const { format } = require('logform');
const path = require('path');

/**
 * Custom log format with color, timestamp, and additional context like UserID and RequestID.
 * @returns {winston.format} - The custom log format with timestamp and message.
 */
const customFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, userId, requestId }) => {
        let logMessage = `${timestamp} [${level}] ${message}`;

        if (userId) logMessage = `[UserID: ${userId}] ` + logMessage;
        if (requestId) logMessage = `[RequestID: ${requestId}] ` + logMessage;

        return logMessage;
    })
);

/**
 * Logger configuration using Winston with console and file transports.
 * @returns {winston.Logger} - Configured logger instance.
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'app.log'),
            level: 'error',
        }),
    ],
});

module.exports = logger;
