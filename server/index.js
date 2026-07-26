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
// Known origins are ALWAYS allowed (so it works even if CLIENT_URL is misconfigured
// on the host); any extra comma-separated origins in CLIENT_URL are merged in.
const KNOWN_ORIGINS = ['http://localhost:5173', 'https://fashion-app-rouge.vercel.app']
const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean)
const allowedOrigins = [...new Set([...KNOWN_ORIGINS, ...envOrigins])]

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (no origin) and any allow-listed origin
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true)
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  })
)
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
