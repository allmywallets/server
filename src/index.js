require('dotenv').config()
const server = require('./server')
const database = require('./database')
const webPush = require('./web-push')

const pushRate = 1000 * 60 * 15 // 15 minutes

server.init()
  .then(app => {
    webPush.init().registerRoute(app, database.saveEndpoint)

    return database.init()
  })
  .then((endpointsDatabase) => {
    setInterval(() => {
      endpointsDatabase.findAll().then(endpoints => {
        console.log(`Notifying ${endpoints.length} endpoints`)

        endpoints.forEach(endpoint => webPush.notify(endpoint.url))
      })
    }, pushRate)

    server.listen()
  })
  .catch(e => console.error(e))
