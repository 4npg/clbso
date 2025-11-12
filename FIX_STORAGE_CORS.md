# 🔧 Fix Firebase Storage CORS Error

The CORS error when uploading to Firebase Storage needs to be fixed in Firebase Console.

## Quick Fix

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Storage** (left sidebar)
4. Click on the **Rules** tab
5. Update the rules to allow uploads from localhost:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read/write if authenticated
      allow read, write: if request.auth != null;
      
      // For development: allow from localhost (remove in production!)
      allow read, write: if request.origin.matches('http://localhost:.*');
    }
  }
}
```

6. Click **Publish**

## Better Production Rules

For production, use more secure rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images - authenticated users can upload
    match /gallery/{imageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null && 
                     request.resource.size < 10 * 1024 * 1024 && // 10MB limit
                     request.resource.contentType.matches('image/.*');
    }
    
    // Default: deny all
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Alternative: Configure CORS via gsutil

If you have `gsutil` installed (Google Cloud SDK):

```bash
# Create a CORS configuration file
cat > cors.json << EOF
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
EOF

# Apply CORS configuration
gsutil cors set cors.json gs://YOUR-BUCKET-NAME.appspot.com
```

Replace `YOUR-BUCKET-NAME` with your actual Firebase Storage bucket name.

## Verify

After updating the rules:
1. Wait a few seconds for changes to propagate
2. Try uploading an image again
3. Check browser console - CORS errors should be gone

