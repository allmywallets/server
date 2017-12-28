const Sequelize = require('sequelize')

async function init () {
  const database = new Sequelize('allmywallets', null, null, {
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'production' ? 'endpoints.sqlite' : ':memory:',
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
