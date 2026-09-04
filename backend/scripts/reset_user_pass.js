const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inkviz';

async function reset() {
  await mongoose.connect(uri);
  const hash = await bcrypt.hash('Password123!', 10);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'samridh@inkviz.app' },
    { $set: { passwordHash: hash, loginAttempts: 0, lockUntil: null } }
  );
  console.log('Password for samridh@inkviz.app successfully set to Password123!');
  process.exit(0);
}

reset().catch(console.error);
