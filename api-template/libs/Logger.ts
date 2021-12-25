import winston from "winston";

const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'info';
console.log('logLevel:', logLevel)

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            level: logLevel,
            stderrLevels: ['error'],
            consoleWarnLevels: ['warn'],
        })
    ],
});

export default logger;