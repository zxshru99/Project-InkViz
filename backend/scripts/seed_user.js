const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inkviz';

async function seedUser() {
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash('Password123!', 10);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'samridh@inkviz.app' },
    {
      $set: {
        name: 'Samridh Chaudhary',
        email: 'samridh@inkviz.app',
        passwordHash,
        plan: 'free',
        invoicePrefix: 'INV-',
        invoiceCounter: 1,
        defaultCurrency: 'USD',
        isEmailVerified: true,
        loginAttempts: 0,
        lockUntil: null,
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true }
  );
  console.log('User samridh@inkviz.app successfully created with Password123!');
  process.exit(0);
}

seedUser().catch(console.error);
