# 📦 Server-Side Image Upload (No Firebase Storage Required)

I've updated the code to use **server-side file uploads** instead of Firebase Storage. This means you don't need a Firebase Blaze plan!

## What Changed

### Backend
- ✅ Added `multer` middleware for file uploads
- ✅ Images are stored in `server/uploads/gallery/` directory
- ✅ Images are served statically via `/uploads/gallery/` endpoint
- ✅ Updated gallery route to handle file uploads

### Frontend
- ✅ Removed Firebase Storage dependency
- ✅ Updated upload to use FormData and send to server
- ✅ Image URLs are automatically constructed from server

## How It Works

1. **User selects image** → Frontend creates FormData
2. **Upload to server** → POST `/api/gallery` with image file
3. **Server saves file** → Stores in `server/uploads/gallery/`
4. **Server saves metadata** → Stores image path in MongoDB
5. **Images served** → Available at `http://localhost:5000/uploads/gallery/filename.jpg`

## File Structure

```
server/
  uploads/
    gallery/
      [uploaded-images-here]
```

## Important Notes

### Development
- Images are stored locally on your server
- Works great for development and small deployments

### Production Considerations
- **For production**, consider:
  1. **Cloud Storage** (AWS S3, Google Cloud Storage, Cloudinary)
  2. **CDN** for faster image delivery
  3. **Image optimization** (resize, compress)
  4. **Backup strategy** for uploaded files

### File Size Limits
- Current limit: **10MB per image**
- Can be changed in `server/middleware/upload.js`

### Supported Formats
- JPEG, JPG, PNG, GIF, WEBP

## Testing

1. **Restart your server** (to load new routes)
2. **Go to Internal Gallery** page
3. **Click "Upload ảnh"**
4. **Select an image**
5. **Fill in details and upload**

The image should upload successfully without Firebase Storage!

## Migration from Firebase Storage

If you had images in Firebase Storage:
- Old images with Firebase URLs will still work (they start with `http`)
- New uploads will use server storage
- You can migrate old images by downloading and re-uploading them

## Future: Cloud Storage Integration

If you want to use cloud storage later, you can:
1. Keep the same API structure
2. Replace `multer` disk storage with cloud storage SDK
3. Update image URLs to cloud URLs

Popular options:
- **Cloudinary** (free tier available)
- **AWS S3** (pay-as-you-go)
- **Google Cloud Storage** (free tier available)
- **ImgBB** (free API)

