/**
 * Quick script to add an event - just edit the event data below and run!
 * Usage: node scripts/addEventQuick.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Member = require('../models/Member');

// ============================================
// EDIT THIS SECTION - Add your event data here
// ============================================
const eventData = {
  title: 'Múa Trung Tâm',
  description: 'Job đầu tiên.',
  type: 'performance', // Options: 'practice', 'performance', 'competition', 'workshop'
  date: new Date('2025-11-20T18:00:00'), // yyyy-mm-ddTHH:MM:ss
  location: 'Trung tâm tiếng Trung Đoan Hùng',
  isPublic: true,
  status: 'completed',

  // Optional: add participants by email (script will resolve them to ObjectIds)
  participantEmails: [
    'louisbenjamin3780@gmail.com', // must exist in DB
    // 'anotherMember@example.com'
  ],

  // Optional: add image URLs (e.g., Cloudinary, local static path, etc.)
  images: [
    'https://drive.google.com/uc?export=view&id=1J3GpyQr5isL5RNI3fTi4N7C3tvxqkdCS'
  ]
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

    // Resolve participants by email
    let participantIds = [];
    if (eventData.participantEmails && eventData.participantEmails.length > 0) {
      const foundMembers = await Member.find({
        email: { $in: eventData.participantEmails.map(e => e.toLowerCase()) }
      });
      participantIds = foundMembers.map(m => m._id);
      
      if (foundMembers.length !== eventData.participantEmails.length) {
        console.warn('⚠️ Some participant emails were not found in the database:');
        const foundEmails = foundMembers.map(m => m.email);
        const missing = eventData.participantEmails.filter(e => !foundEmails.includes(e.toLowerCase()));
        console.warn('   Missing:', missing);
      }
    }

    // Create event
    const event = new Event({
      title: eventData.title,
      description: eventData.description || '',
      type: eventData.type,
      date: eventData.date,
      location: eventData.location || '',
      participants: participantIds,
      images: eventData.images || [],
      isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
      status: eventData.status || 'upcoming'
    });

    await event.save();

    console.log('✅ Event added successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Title: ${event.title}`);
    console.log(`   Type: ${event.type}`);
    console.log(`   Date: ${event.date.toLocaleString()}`);
    console.log(`   Location: ${event.location}`);
    console.log(`   Participants: ${event.participants.length}`);
    console.log(`   Status: ${event.status}`);
    console.log(`   ID: ${event._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error:', error.message);
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
