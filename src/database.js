const Sequelize = require('sequelize')

async function init () {
  const database = new Sequelize('allmywallets', null, null, {
    dialect: 'sqlite',
    storage: 'endpoints.sqlite',
    operatorsAliases: false,
    logging: false
  })

  const model = database.define('endpoint', {
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  await database.sync()

  return model
}

module.exports = { init }
