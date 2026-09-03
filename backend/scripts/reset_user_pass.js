const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://sinhasadhusharan_db_user:ZzKXa5LqUhKD7Vb7@inkviz.t7ouoo2.mongodb.net/inkviz';

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
