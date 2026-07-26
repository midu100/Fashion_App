require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dbConfig = require('./dbConfig')
const cloudinaryConfig = require('./utils/cloudinaryConfig')
const route = require('./routes')
const { startDigestCron } = require('./jobs/digestCron')

const app = express()
const port = process.env.PORT || 8000

// ====== CORS — allow-list ======
// Allows: any Vercel deployment of this project (production alias, git-branch &
// preview URLs all end in .vercel.app), any localhost port, plus any explicit
// origins from CLIENT_URL. Disallowed origins are cleanly blocked (never a 500).
const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean)
const staticAllow = new Set(['http://localhost:5173', 'https://fashion-app-rouge.vercel.app', ...envOrigins])

const isAllowedOrigin = (origin) => {
  if (!origin) return true // non-browser tools (curl, server-to-server)
  const clean = origin.replace(/\/$/, '')
  return (
    staticAllow.has(clean) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(clean) || // any Vercel deploy URL
    /^http:\/\/localhost(:\d+)?$/i.test(clean)
  )
}

app.use(cors({ origin: (origin, callback) => callback(null, isAllowedOrigin(origin)), credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ====== Config
dbConfig()
cloudinaryConfig()

// ====== Routes
app.use(route)
app.get('/', (req, res) => res.status(200).send({ message: 'KAZIR NATION API is running 🚀' }))

// ====== Scheduled jobs (AI business digest)
startDigestCron()

// ====== Server
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
