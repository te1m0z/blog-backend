import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { NODE_ENV } from './env'
import { isObj } from '@/helpers/object'

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const logger = createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    enumerateErrorFormat(),
    format.splat(),
    format.timestamp({
      format: 'YYYY.MM.DD::HH:mm',
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    }),
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '3m',
      maxFiles: '15d',
    }),
  ],
})

function logError(message: string, ...values: unknown[]) {
  //
  const valuesArr = values.map((val) => {
    //
    if (isObj(val)) {
      return JSON.stringify(val)
    }
    //
    return val
  })
  //
  logger.error(`${message} :: ${valuesArr.join(' - ')}`)
}

export { logger, logError }

