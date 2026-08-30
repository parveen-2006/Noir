import dotenv from 'dotenv'
import express from 'express'
import connectDatabase from './config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

connectDatabase()
