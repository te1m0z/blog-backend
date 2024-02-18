import { type Express } from 'express'
import { init, Integrations } from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { SENTRY_DSN } from '@/config/env'

function initSentry(app: Express) {
  //
  init({
    dsn: SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Integrations.Express({ app }),
      //
      new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  })
}

export {
  initSentry,
}
