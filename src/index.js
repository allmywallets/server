require('dotenv').config()
const server = require('./server')
const database = require('./database')
const push = require('./push')

async function run () {
  const app = await server.init()
  const db = await database.init()

  await push.init(app, db)

  server.listen()
}

run()
