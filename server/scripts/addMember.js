/**
 * Script to add members to the database
 * Usage: node scripts/addMember.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('../models/Member');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sow-club';

async function addMember(memberData) {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if member already exists
    const existing = await Member.findOne({ email: memberData.email.toLowerCase() });
    if (existing) {
      console.log(`⚠️  Member with email ${memberData.email} already exists`);
      return existing;
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
    console.log(`✅ Member added successfully: ${member.name} (${member.email})`);
    console.log(`   Role: ${member.role}`);
    console.log(`   ID: ${member._id}`);
    
    return member;
  } catch (error) {
    console.error('❌ Error adding member:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
}

// Example usage
if (require.main === module) {
  // Example: Add a member
  const exampleMember = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'member', // 'member', 'admin', or 'leader'
    position: 'Dancer',
    bio: 'Passionate dancer and member of S.O.W Club',
    isActive: true
  };

  // Uncomment and modify to add a member:
  // addMember(exampleMember)
  //   .then(() => {
  //     console.log('✅ Done!');
  //     process.exit(0);
  //   })
  //   .catch((error) => {
  //     console.error('❌ Failed:', error);
  //     process.exit(1);
  //   });

  // Or add multiple members:
  const members = [
    {
      name: 'Admin User',
      email: 'admin@sowclub.com',
      role: 'admin',
      position: 'Administrator',
      isActive: true
    },
    {
      name: 'Leader User',
      email: 'leader@sowclub.com',
      role: 'leader',
      position: 'Club Leader',
      isActive: true
    }
  ];

  console.log('📝 To add members, uncomment the code below and modify the member data:');
  console.log('');
  console.log('Example:');
  console.log(JSON.stringify(exampleMember, null, 2));
  console.log('');
  console.log('Or add multiple members:');
  console.log(JSON.stringify(members, null, 2));
}

module.exports = { addMember };

