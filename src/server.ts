import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import { config } from 'dotenv'
import { Server } from 'http'
import router from './utils/router'

require('express-async-errors')

// Load the env files
config()

// Setting up the actual server
const app = express()
const server = new Server(app)

// allow client ip from x-forwarded-for header
app.set('trust proxy', true)

// define middleware
app.use(helmet())
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }))
app.use(cors({ origin: true, credentials: true }))
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))


if (process.env.NODE_ENV !== 'testing') {
  // Set the public directory
  app.use(express.static('public'))
}

// Run router function to launch endpoints
app.use(router())

// prioritize environment variables
const port = process.env.PORT ? parseInt(process.env.PORT) : 8000
const host = process.env.HOST || '0.0.0.0'

// prevents the server from actually starting,
// useful for when tests are running
if (typeof module !== 'undefined' && require.main === module) {
  server.listen(port, host, () => {
    console.log('⚡️ Server started ⚡️')
  })
}

export default app

