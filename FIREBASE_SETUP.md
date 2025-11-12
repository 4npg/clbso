# 🔥 Firebase Setup Guide

This guide will help you set up Firebase for the S.O.W Club website.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "SOW Club")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

## Step 2: Register a Web App

1. In your Firebase project, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register your app:
   - App nickname: "SOW Club Website" (or any name)
   - **Do NOT** check "Also set up Firebase Hosting"
   - Click **"Register app"**
6. **Copy the Firebase configuration object** - you'll need these values

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"** if you haven't enabled it yet
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle **"Enable"** to ON
6. Enter a **Project support email** (your email)
7. Click **"Save"**

## Step 4: Set Up Firebase Storage (for image uploads)

1. In Firebase Console, go to **Storage** (left sidebar)
2. Click **"Get started"**
3. Choose **"Start in test mode"** (you can change rules later)
4. Select a location for your storage bucket (choose closest to your users)
5. Click **"Done"**

## Step 5: Configure Your .env File

1. In the `client` directory, make sure you have a `.env` file (copy from `.env.example` if needed)
2. Open `client/.env` in a text editor
3. Replace the placeholder values with your actual Firebase config:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSy...your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Google Forms URL (optional - for availability form)
REACT_APP_GOOGLE_FORM_URL=https://forms.gle/your-form-id
```

### Where to find each value:

- **REACT_APP_FIREBASE_API_KEY**: From the config object, it's the `apiKey` field
- **REACT_APP_FIREBASE_AUTH_DOMAIN**: From the config object, it's the `authDomain` field
- **REACT_APP_FIREBASE_PROJECT_ID**: From the config object, it's the `projectId` field
- **REACT_APP_FIREBASE_STORAGE_BUCKET**: From the config object, it's the `storageBucket` field
- **REACT_APP_FIREBASE_MESSAGING_SENDER_ID**: From the config object, it's the `messagingSenderId` field
- **REACT_APP_FIREBASE_APP_ID**: From the config object, it's the `appId` field

## Step 6: Restart Your Development Server

**IMPORTANT**: After updating `.env`, you MUST restart your React development server:

1. Stop the server (Ctrl+C in the terminal)
2. Start it again: `npm start` (in the client directory)

React only reads environment variables when the server starts, so changes won't take effect until you restart.

## Step 7: Verify Setup

1. Open your browser console (F12)
2. Look for: `✅ Firebase initialized successfully`
3. If you see errors, check:
   - Are all values in `.env` correct? (no typos, no extra spaces)
   - Did you restart the server after updating `.env`?
   - Is Google Sign-In enabled in Firebase Console?

## Common Issues

### "auth/configuration-not-found" Error

**Cause**: Firebase API key exists but project configuration is invalid.

**Solutions**:
1. Verify your API key is correct (copy from Firebase Console)
2. Make sure Google Sign-In is enabled in Firebase Console
3. Check that your project ID matches in all fields
4. Ensure there are no extra spaces or quotes in your `.env` file

### "auth/invalid-api-key" Error

**Cause**: The API key in your `.env` is incorrect or from a different project.

**Solutions**:
1. Go to Firebase Console > Project Settings > Your apps
2. Copy the API key again
3. Make sure you're using the correct project
4. Update `.env` and restart the server

### Firebase Not Initializing

**Cause**: Missing or incorrect environment variables.

**Solutions**:
1. Check browser console for specific missing variables
2. Verify all 6 Firebase variables are in `.env`
3. Make sure variable names start with `REACT_APP_`
4. No quotes needed around values in `.env`

## Testing

Once configured:
1. Go to `/login` page
2. Click "Đăng nhập với Google"
3. You should see Google's sign-in popup
4. After signing in, you should be redirected to `/internal`

## Need Help?

- Check the browser console for detailed error messages
- Verify your Firebase project is active in [Firebase Console](https://console.firebase.google.com)
- Make sure all services (Authentication, Storage) are enabled

