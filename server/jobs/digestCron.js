const cron = require('node-cron')
const { generateDigest } = require('../utils/automations')

// ====== Scheduled AI business digest ======
// Emails the owner a digest on a cron schedule (default: 9:00 AM daily).
// Skips entirely when AGENT_DIGEST_TO is not configured.
const startDigestCron = () => {
  if (!process.env.AGENT_DIGEST_TO) {
    console.log('AI digest cron: AGENT_DIGEST_TO not set — skipping schedule.')
    return
  }
  const schedule = process.env.AGENT_DIGEST_CRON || '0 9 * * *'
  if (!cron.validate(schedule)) {
    console.log('AI digest cron: invalid AGENT_DIGEST_CRON, skipping.')
    return
  }
  cron.schedule(schedule, async () => {
    try {
      const r = await generateDigest()
      console.log('AI digest sent:', r)
    } catch (error) {
      console.log('AI digest error:', error?.message || error)
    }
  })
  console.log(`AI digest cron scheduled (${schedule}) → ${process.env.AGENT_DIGEST_TO}`)
}

module.exports = { startDigestCron }
