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

// ====== Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
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
