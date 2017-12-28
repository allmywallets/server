const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const corsOptions = {
  origin: process.env.CORS_ORIGIN
}

function init () {
  app.use(cors(corsOptions))
  app.use(bodyParser.json())

  return app
}

function listen () {
  const port = process.env.PORT || 3030
  app.listen(port, () => console.log(`Server listening on port ${port}`))
}

module.exports = { init, listen }
