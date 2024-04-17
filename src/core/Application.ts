import type { Server } from 'node:http'
import express, { type Express } from 'express'
import morgan from 'morgan'
import { type WriteStream, createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { testDatabaseConnection } from '@/init/db'
import { userRouter } from '@/entities/user/user.routes'
import { noteRouter } from '@/entities/note/note.routes'
import { csrfRouter } from '@/entities/csrf/csrf.routes'
import { jwtRouter } from '@/entities/jwt/jwt.routes'
import { MGzip } from '@/middlewares/compression'
import { MFatal } from '@/middlewares/error'
import { MCors } from '@/middlewares/cors'
import { MJson } from '@/middlewares/json'
import * as SentryHandlers from '@/middlewares/sentry'
import { EXPRESS_PORT } from '@/config/env'
import { initSentry } from '@/config/sentry'
import { logError } from '@/config/logger'

class Application {
  //
  private app: Express
  //
  private server: Server | undefined
  //
  private logFileStream: WriteStream | null
  
  /**
   * Creates App instance.
   */
  public constructor() {
    //
    this.logFileStream = createWriteStream('./access.txt', { flags: 'a' })
    //
    this.init()
    //
    this.app = express()
    //
    this.bootstrap()
  }
  //
  public run() {
    //
    if (this.server) this.server.close()
    //
    this.server = this.app.listen(EXPRESS_PORT, () => {
      // eslint-disable-next-line no-console
      console.log('Server started on port: ' + EXPRESS_PORT)
    })
  }
  //
  private async init() {
    //
    this.setupErrorHandler()
    //
    await testDatabaseConnection()
  }
  //
  private bootstrap() {
    //
    // this.app.disable('x-powered-by')
    //
    initSentry(this.app)
    //
    //  
    this.setupMiddlewares()
  }
  //
  // private setupHeaders() {
  //   this.app.se
  // }
  //
  private setupMiddlewares() {
    /* Logs */
    // @ts-expect-error: Unreachable code error
    this.app.use(morgan('combined', { stream: this.logFileStream }))
    /* Sentry */
    this.app.use(SentryHandlers.MSentryRequestHandler)
    this.app.use(SentryHandlers.MSentryTracingHandler)
    /* NPM packages middlewars */
    this.app.use(MJson)
    this.app.use(MGzip)
    this.app.use(MCors)
    // this.app.use(MSession)
    /* App routers */
    this.app.use(userRouter)
    this.app.use(noteRouter)
    this.app.use(csrfRouter)
    this.app.use(jwtRouter)
    /* Uncaught error on the server */
    this.app.use(SentryHandlers.MSentryErrorHandler)
    this.app.use(MFatal)
  }
  //
  private setupErrorHandler() {
    //
    const unexpectedErrorHandler = async (error: unknown) => {
      //
      logError('Fatal Node.js Error', JSON.stringify(error))
      //
      if (this.server) this.server.close()
      //
      process.exit(1)
    }
    //
    process.on('uncaughtException', unexpectedErrorHandler)
    process.on('unhandledRejection', unexpectedErrorHandler)
  }
  
  /**
   * Get the instance of current application
   * @returns {Express}
   */
  public getApp(): Express {
    return this.app
  }
  
  /**
   * Get the instance of current server
   * @returns {Server | undefined}
   */
  public getServer(): Server | undefined {
    return this.server
  }
}

export {
  Application,
}