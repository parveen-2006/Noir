import mongoose from 'mongoose'

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.error('MongoDB connection unavailable: MONGODB_URI is missing in backend/.env')
    return
  }

  if (mongoUri.includes('<db_username>') || mongoUri.includes('<db_password>')) {
    console.error('MongoDB connection unavailable: MONGODB_URI is still a placeholder. Update backend/.env with the real MongoDB Atlas connection string.')
    return
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection unavailable: check the Atlas URI, cluster status, and network/IP whitelist.')
    console.error(error.message)
  }
}

export default connectDatabase
