const webPush = require('web-push')
const url = require('url')
const { Op } = require('sequelize')

const pushRate = 1000 * 60 * 15 // 15 minutes

function registerRoute (app, model) {
  app.get('/', async (req, res) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const stats = {
      total: await model.count(),
      lastDay: await model.count({ where: { updatedAt: {[Op.gt]: yesterday }}}),
      lastMonth: await model.count({ where: { updatedAt: {[Op.gt]: lastMonth }}})
    }

    return res.status(200).json({ stats: stats }).end()
  })

  app.post('/push/register', async (req, res) => {
    const endpoint = req.body.endpoint

    if (!endpoint || typeof endpoint !== 'string' || endpoint.length === 0 || url.parse(endpoint).hostname === null) {
      return res.status(400).json('The subscription endpoint must be a valid url.').end()
    }

    let code = 500
    try {
      const existing = await model.findOne({where: {url: endpoint}})

      if (existing) {
        await existing.update({url: endpoint})
        code = 204
      } else {
        await model.create({url: endpoint})
        code = 201
      }
    } catch (e) {
      console.error(e)

      return res.status(500).json('Failed to save endpoint.').end()
    }

    return res.status(code).end()
  })
}

function startNotifier (model) {
  setInterval(() => {
    model.findAll().then(endpoints => {
      console.log(`Notifying ${endpoints.length} endpoints`)

      endpoints.forEach(function (endpoint) {
        webPush.sendNotification({ endpoint: endpoint.url }, null, { TTL: pushRate/1000 })
      })
    })
  }, pushRate)
}

function init (app, model) {
  webPush.setVapidDetails('https://allmywallets.io', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)

  registerRoute(app, model)
  startNotifier(model)
}

module.exports = { init }
