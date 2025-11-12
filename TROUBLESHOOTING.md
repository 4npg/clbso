# 🔧 Troubleshooting Guide

## Issue 1: 404 Error on `/api/auth/login`

### Check if server is running:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### Restart the server:
```bash
cd server
npm run dev
# or
npm start
```

### Verify the route is working:
Open browser and go to: `http://localhost:5000/api/health`

You should see: `{"status":"OK","message":"S.O.W Club API is running"}`

### Check server logs:
Look for any errors in the server console. The route should be registered as:
```
app.use('/api/auth', require('./routes/auth'));
```

## Issue 2: Firebase Storage CORS Error

### Quick Fix (Firebase Console):

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**
3. **Go to Storage** (left sidebar)
4. **Click on "Rules" tab**
5. **Replace the rules with**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow authenticated users to read/write
      allow read, write: if request.auth != null;
      
      // Allow from localhost for development
      allow read, write: if request.origin.matches('http://localhost:.*');
    }
  }
}
```

6. **Click "Publish"**

### Better Production Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery folder - authenticated users can upload images
    match /gallery/{imageId} {
      // Anyone can read
      allow read: if true;
      
      // Only authenticated users can write
      allow write: if request.auth != null 
                     && request.resource.size < 10 * 1024 * 1024  // 10MB limit
                     && request.resource.contentType.matches('image/.*');
    }
    
    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Verify Storage is enabled:
1. Go to **Storage** in Firebase Console
2. Make sure it says "Storage is enabled"
3. If not, click "Get started" and set it up

## Issue 3: Cross-Origin-Opener-Policy Warnings

These are **harmless warnings** from Firebase's popup authentication. They don't affect functionality and can be ignored.

If you want to suppress them, you can add this to your `public/index.html`:

```html
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
```

## Common Solutions

### Server not responding:
1. Check MongoDB is running
2. Check `server/.env` has correct `MONGODB_URI`
3. Restart the server

### 404 on all API routes:
1. Make sure server is running on port 5000
2. Check `client/.env` has: `REACT_APP_API_URL=http://localhost:5000/api`
3. Restart both client and server

### CORS errors:
1. Update Firebase Storage rules (see above)
2. Wait a few seconds after publishing rules
3. Clear browser cache and try again

### Authentication not working:
1. Verify member exists in database
2. Check email matches exactly (case-insensitive but must match)
3. Verify Firebase is configured correctly in `client/.env`
4. Make sure Google Sign-In is enabled in Firebase Console

## Testing Checklist

- [ ] Server is running on port 5000
- [ ] MongoDB is connected
- [ ] Member exists in database
- [ ] Firebase is configured in `client/.env`
- [ ] Google Sign-In is enabled in Firebase Console
- [ ] Firebase Storage rules allow uploads
- [ ] Both client and server are restarted after .env changes

