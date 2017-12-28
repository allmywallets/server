import fs from 'fs'
import path from 'path'
import { test } from 'ava'
import request from 'supertest'
import server from '../src/server'
import database from '../src/database'
import push from '../src/push'

process.env.VAPID_PUBLIC = 'BPFt4jC7e8l7H99qE1wTtN1XaO5cFWlttdtW2HKWI8CJe2pA1Ijh8F44HAX1EYqcJf-EFbR9Vv6MyX-0lbTPsKE'
process.env.VAPID_PRIVATE = 'btGQgpDwDcrsU4zg0v_BTS2xJXrMa1C8BSrtnCFTKLY'

let app = null
test.beforeEach(async () => {
  fs.unlink(path.join(__dirname, '/../endpoints.sqlite'))

  app = await server.init()
  const model = await database.init(app)
  await push.init(app, model)

  app.listen()
})

test.serial('Add a valid endpoint', async assert => {
  const res = await request(app)
    .post('/push/register')
    .type('json')
    .send({ endpoint: 'http://localhost' })

  assert.is(res.status, 201)
})

test.serial('Updates an existing endpoint', async assert => {
  await request(app).post('/push/register').type('json').send({ endpoint: 'http://localhost' })
  const res = await request(app).post('/push/register').type('json').send({ endpoint: 'http://localhost' })

  assert.is(res.status, 204)
})

test.serial('Refuses an empty endpoint', async assert => {
  const res = await request(app).post('/push/register')

  assert.is(res.status, 400)
  assert.is(res.body, 'The subscription endpoint must be a valid url.')
})

test.serial('Refuses an invalid endpoint', async assert => {
  const res = await request(app)
    .post('/push/register')
    .type('json')
    .send({ endpoint: 'Hello world!' })

  assert.is(res.status, 400)
  assert.is(res.body, 'The subscription endpoint must be a valid url.')
})
