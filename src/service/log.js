const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format
let now = new Date()
let logTS =
  now.getFullYear() +
  '_' +
  (now.getMonth() + 1) +
  '_' +
  now.getDate() +
  '_' +
  now.getHours() +
  '_' +
  now.getMinutes() +
  '_' +
  now.getSeconds()

global.log = createLogger({
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp}: ${message}`
    })
  ),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL_CONSOLE,
      format: combine(
        colorize(),
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `[${timestamp}][${level}] ${message}`
        })
      )
    }),
    new transports.File({
      filename: process.env.SETTING_LOGS_PATH + logTS + '_debug.log',
      level: 'debug',
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}: ${message}`
        })
      )
    }),
    new transports.File({
      filename: process.env.SETTING_LOGS_PATH + logTS + '_info.log',
      level: 'info',
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}: ${message}`
        })
      )
    })
  ]
})
