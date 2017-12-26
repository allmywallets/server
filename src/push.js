const webPush = require('web-push')
const url = require('url')

function init () {
  webPush.setVapidDetails('https://allmywallets.io', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)

  return this
}

function registerRoute (app, saveEndpoint) {
  app.post('/push/register', (req, res) => {
    const endpoint = req.body.endpoint
    console.log(endpoint)

    if (!endpoint || typeof endpoint !== 'string' || endpoint.length === 0 || url.parse(endpoint).hostname === null) {
      return res.status(400).json('The subscription endpoint must be a valid url.')
    }

    return saveEndpoint(endpoint)
      .then(() => res.json('ok'))
      .catch(() => res.status(500).json('ko'))
  });
}

function notify (endpoint) {
  webPush.sendNotification({ endpoint: endpoint })
}

module.exports = { init, registerRoute, notify }
