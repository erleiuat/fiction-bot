const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format
const fs = require('fs')
const timezoned = () => {
  let d = new Date()
  return (
    d.getFullYear() +
    '.' +
    global.nZero.form(d.getMonth() + 1) +
    '.' +
    global.nZero.form(d.getDate()) +
    '/' +
    global.nZero.form(d.getHours()) +
    '.' +
    global.nZero.form(d.getMinutes()) +
    '.' +
    global.nZero.form(d.getSeconds()) +
    '.' +
    global.nZero.form(d.getMilliseconds())
  )
}

let fFull = timezoned()
let fName = fFull.substring(fFull.indexOf('/') + 1)
let fPath = process.env.SETTING_LOGS_PATH + fFull.substring(0, fFull.indexOf('/') + 1)
if (!fs.existsSync(fPath)) fs.mkdirSync(fPath, { recursive: true })

global.log = createLogger({
  format: combine(
    timestamp({
      format: timezoned
    }),
    printf(({ level, message, timestamp }) => {
      return `[${timestamp}][${level}] ${message}`
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
      filename: fPath + fName + '_debug.log',
      level: 'debug',
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}: ${message}`
        })
      )
    }),
    new transports.File({
      filename: fPath + fName + '_info.log',
      level: 'info',
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}: ${message}`
        })
      )
    }),
    new transports.File({
      filename: fPath + fName + '_error.log',
      level: 'error',
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp}: ${message}`
        })
      )
    })
  ]
})
