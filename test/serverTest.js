import { test } from 'ava'
import request from 'supertest'
import server from '../src/server'
import database from '../src/database'
import push from '../src/push'

process.env.VAPID_PUBLIC = 'BPFt4jC7e8l7H99qE1wTtN1XaO5cFWlttdtW2HKWI8CJe2pA1Ijh8F44HAX1EYqcJf-EFbR9Vv6MyX-0lbTPsKE'
process.env.VAPID_PRIVATE = 'btGQgpDwDcrsU4zg0v_BTS2xJXrMa1C8BSrtnCFTKLY'

test.beforeEach(async t => {
  const app = await server.init()
  const model = await database.init(app)
  await push.init(app, model)

  app.listen()

  t.context = { app: app }
})

test.serial('Has empty statistics on start', async t => {
  const res = await request(t.context.app).get('/')

  t.is(res.status, 200)
  t.deepEqual(res.body, { stats: { total: 0, lastDay: 0, lastMonth: 0 } })
})

test.serial('Updates statistics on register', async t => {
  await request(t.context.app)
    .post('/push/register')
    .type('json')
    .send({ endpoint: 'http://localhost' })

  const res = await request(t.context.app).get('/')

  t.is(res.status, 200)
  t.deepEqual(res.body, { stats: { total: 1, lastDay: 1, lastMonth: 1 } })
})

test.serial('Add a valid endpoint', async t => {
  const res = await request(t.context.app)
    .post('/push/register')
    .type('json')
    .send({ endpoint: 'http://localhost.valid' })

  t.is(res.status, 201)
})

test.serial('Updates an existing endpoint', async t => {
  await request(t.context.app).post('/push/register').type('json').send({ endpoint: 'http://localhost' })
  const res = await request(t.context.app).post('/push/register').type('json').send({ endpoint: 'http://localhost' })

  t.is(res.status, 204)
})

test.serial('Refuses an empty endpoint', async t => {
  const res = await request(t.context.app).post('/push/register')

  t.is(res.status, 400)
  t.is(res.body, 'The subscription endpoint must be a valid url.')
})

test.serial('Refuses an invalid endpoint', async t => {
  const res = await request(t.context.app)
    .post('/push/register')
    .type('json')
    .send({ endpoint: 'Hello world!' })

  t.is(res.status, 400)
  t.is(res.body, 'The subscription endpoint must be a valid url.')
})
