const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, printf } = format;

const LOGLEVEL = (process.env.LOGLEVEL || 'debug').toLowerCase();

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logTransports = [
  new (winston.transports.Console)({
    stderrLevels: ['error', 'debug', 'warn', 'info'],
  }),

  new winston.transports.File({
    name: 'error-file',
    filename: './storage/logs/backend.log',
    stderrLevels: ['error', 'debug', 'warn', 'info'],
    json: false
  }),

];

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: 'YYYY-mm-dd HH:mm:ss' }),
    logFormat
  ),
  transports: logTransports,
  level: LOGLEVEL,
});

module.exports = logger;
