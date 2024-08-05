/* eslint-disable no-console */
import pino from 'pino'

namespace ClientLogger {
  export enum LOG_LEVEL {
    TRACE = 'trace',
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal'
  }

  export interface ILogger {
    trace: pino.Logger['trace']
    debug: pino.Logger['debug']
    info: pino.Logger['info']
    warn: pino.Logger['warn']
    error: pino.Logger['error']
    fatal: pino.Logger['fatal']
  }
}

class CustomLogger implements ClientLogger.ILogger {
  declare trace: pino.LogFn
  declare debug: pino.LogFn
  declare info: pino.LogFn
  declare warn: pino.LogFn
  declare error: pino.LogFn
  declare fatal: pino.LogFn

  private _createLogger = () =>
    pino({
      name: process.env.SERVICE_NAME
        ? `${process.env.SERVICE_NAME}-logger`
        : 'app-logger',
      level: process.env.LOG_LEVEL || ClientLogger.LOG_LEVEL.INFO,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          levelFirst: true,
          ignore: 'pid,hostname',
          singleLine: true
        }
      }
    })

  constructor() {
    this.trace = console.trace.bind(this)
    this.debug = console.debug.bind(this)
    this.info = console.info.bind(this)
    this.warn = console.warn.bind(this)
    this.error = console.error.bind(this)
    this.fatal = console.error.bind(this)
  }

  createLogger = () => {
    const logger = this._createLogger()
    this.trace = logger.trace.bind(logger)
    this.debug = logger.debug.bind(logger)
    this.info = logger.info.bind(logger)
    this.warn = logger.warn.bind(logger)
    this.error = logger.error.bind(logger)
    this.fatal = logger.fatal.bind(logger)
    return logger
  }
}

export const Logger = new CustomLogger()
