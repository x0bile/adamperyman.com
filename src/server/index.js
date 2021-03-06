import express from 'express'
import bodyParser from 'body-parser'

import logger from 'happy-log'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.PORT = process.env.PORT || 8080

const onUnhandledError = err => {
  try {
    logger.error(err)
  } catch (error) {
    console.log('Logger Error: ', error) // eslint-disable-line no-console
    console.log('Application Error: ', err) // eslint-disable-line no-console
  }

  process.exit(1)
}

process.on('unhandledRejection', onUnhandledError)
process.on('uncaughtException', onUnhandledError)

const setupAppRoutes = process.env.NODE_ENV === 'development'
  ? require('./middleware/development').default
  : require('./middleware/production').default

const app = express()

app.set('env', process.env.NODE_ENV)
logger.info(`Application env: ${process.env.NODE_ENV}.`)

app.use(logger.expressMiddleware)
app.use(bodyParser.json())

setupAppRoutes(app)

app.listen(process.env.PORT, () => {
  logger.info(`HTTP server is now running on http://localhost:${process.env.PORT}`)
})
