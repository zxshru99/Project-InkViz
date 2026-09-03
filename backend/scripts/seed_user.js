const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://sinhasadhusharan_db_user:ZzKXa5LqUhKD7Vb7@inkviz.t7ouoo2.mongodb.net/inkviz';

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
