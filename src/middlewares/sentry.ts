import { Handlers } from '@sentry/node'

const MSentryRequestHandler = Handlers.requestHandler()

const MSentryTracingHandler = Handlers.tracingHandler()

const MSentryErrorHandler = Handlers.errorHandler()

export {
  MSentryRequestHandler,
  MSentryTracingHandler,
  MSentryErrorHandler,   
}