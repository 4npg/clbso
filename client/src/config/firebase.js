import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Validate required environment variables
const requiredEnvVars = {
  REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = missingVars.length === 0;

if (!isFirebaseConfigured) {
  console.warn('⚠️ Firebase is not configured. Missing environment variables:', missingVars.join(', '));
  console.warn('📝 Please create a .env file in the client directory with the required variables.');
  console.warn('📖 See client/.env.example for reference.');
  console.warn('🔐 Authentication and file upload features will not work until Firebase is configured.');
}

// Only initialize Firebase if all required variables are present
let app = null;
let auth = null;
let storage = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    // Validate that values aren't just placeholders
    const hasPlaceholderValues = Object.values(firebaseConfig).some(
      value => !value || value.includes('your-') || value === 'your-project-id' || value === 'your-firebase-api-key'
    );

    if (hasPlaceholderValues) {
      console.error('❌ Firebase configuration contains placeholder values. Please update your .env file with actual Firebase credentials.');
      console.error('📖 Get your Firebase config from: https://console.firebase.google.com');
    } else {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      storage = getStorage(app);
      googleProvider = new GoogleAuthProvider();
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error('💡 Common issues:');
    console.error('   - Invalid API key or project ID');
    console.error('   - Firebase project not properly set up');
    console.error('   - Authentication not enabled in Firebase Console');
    console.error('   - Check Firebase Console: https://console.firebase.google.com');
  }
} else {
  // Create mock objects to prevent crashes when Firebase is not configured
  console.warn('⚠️ Using mock Firebase objects. Please configure Firebase to enable authentication.');
}

export { auth, storage, googleProvider };
export default app;

