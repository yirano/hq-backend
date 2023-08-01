import env from '../src/utils/env'

env.load()

export default {
  client: 'pg',
  connection: process.env.NODE_ENV === 'testing'
    ? process.env.TESTING_DATABASE_URL
    : process.env.DATABASE_URL,
}

