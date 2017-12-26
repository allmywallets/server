require('dotenv').config()
const server = require('./server')
const database = require('./database')
const push = require('./push')

const pushRate = 1000 * 60 * 15 // 15 minutes

server.init()
  .then(app => {
      push.init().registerRoute(app, database.saveEndpoint)

    return database.init()
  })
  .then((endpointsDatabase) => {
    setInterval(() => {
      endpointsDatabase.findAll().then(endpoints => {
        console.log(`Notifying ${endpoints.length} endpoints`)

        endpoints.forEach(endpoint => push.notify(endpoint.url))
      })
    }, pushRate)

    server.listen()
  })
  .catch(e => console.error(e))
