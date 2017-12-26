const Sequelize = require('sequelize')

let model = null
function init () {
  const database = new Sequelize('allmywallets', null, null, {
    dialect: 'sqlite',
    storage: 'endpoints.sqlite',
    operatorsAliases: false
  })

  model = database.define('endpoint', {
    url: {
      type: Sequelize.STRING
    }
  })

  return database.sync().then(() => model)
}

function saveEndpoint (endpoint) {
  return model.create({ url: endpoint, allowNull: false })
}

module.exports = { init, saveEndpoint }
