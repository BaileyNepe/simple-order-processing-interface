import 'dotenv/config'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { createContext } from './lib/context'
import { appRouter } from './routers/index'

const app = express() as express.Express

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001'

app.use(
  cors({
    origin: corsOrigin || '',
    methods: ['GET', 'POST', 'OPTIONS']
  })
)

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).send('OK')
})

const port = process.env.PORT || 5001
app.listen(port, () => {})

export default app
