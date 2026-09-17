import dns from 'node:dns'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Role from '../models/Role.js'
import User from '../models/User.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const defaultPermissions = [
  'dashboard.view', 'users.view', 'users.create', 'users.update', 'users.delete',
  'roles.view', 'roles.create', 'roles.update', 'roles.delete',
]

const seedDefaultData = async () => {
  const role = await Role.findOneAndUpdate(
    { name: 'Administrator' },
    {
      $setOnInsert: {
        description: 'Full access and system configuration.',
        permissions: defaultPermissions,
      },
    },
    { new: true, upsert: true },
  )

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@noir.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const existingAdmin = await User.findOne({ email: adminEmail })

  if (!existingAdmin) {
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: role.name,
      status: 'Active',
    })
    console.log(`Default administrator created for ${adminEmail}`)
  }
}

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
    await seedDefaultData()
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection unavailable: check the Atlas URI, cluster status, and network/IP whitelist.')
    console.error(error.message)
    throw error
  }
}

export default connectDatabase
