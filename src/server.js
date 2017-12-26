const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const corsOptions = {
  origin: process.env.CORS_ORIGIN
}

async function init () {
  app.use(cors(corsOptions))
  app.use(bodyParser.json())

  return app
}

function listen () {
  app.listen(3030, () => console.log('Server listening on port 3030'));
}

module.exports = { init, listen }
