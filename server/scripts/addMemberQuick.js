/**
 * Quick script to add a member - just edit the member data below and run!
 * Usage: node scripts/addMemberQuick.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('../models/Member');

// ============================================
// EDIT THIS SECTION - Add your member data here
// ============================================
const memberData = {
  name: '4npg',
  email: 'louisbenjamin3780@gmail.com',  // ⚠️ IMPORTANT: Use the email from your Google account
  role: 'admin',  // Options: 'member', 'admin', 'leader'
  position: 'Administrator',
  bio: 'First admin user',
  isActive: true
};
// ============================================

async function main() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sow-club';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Check if member already exists
    const existing = await Member.findOne({ email: memberData.email.toLowerCase() });
    if (existing) {
      console.log(`⚠️  Member with email ${memberData.email} already exists!`);
      console.log(`   Name: ${existing.name}`);
      console.log(`   Role: ${existing.role}`);
      console.log(`   ID: ${existing._id}`);
      await mongoose.connection.close();
      return;
    }

    // Create new member
    const member = new Member({
      name: memberData.name,
      email: memberData.email.toLowerCase(),
      role: memberData.role || 'member',
      position: memberData.position || '',
      bio: memberData.bio || '',
      avatar: memberData.avatar || '',
      isActive: memberData.isActive !== undefined ? memberData.isActive : true,
    });

    await member.save();
    
    console.log('✅ Member added successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name: ${member.name}`);
    console.log(`   Email: ${member.email}`);
    console.log(`   Role: ${member.role}`);
    console.log(`   Position: ${member.position}`);
    console.log(`   ID: ${member._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now log in with Google using this email address!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   This email is already registered.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

