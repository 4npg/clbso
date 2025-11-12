# 👥 How to Add Members to the Database

There are several ways to add members to the S.O.W Club database. Choose the method that works best for you.

## Method 1: Using the API Endpoint (Easiest)

Use the `/api/auth/register` endpoint to add members. This doesn't require authentication.

### Using cURL (Command Line)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "member",
    "position": "Dancer"
  }'
```

### Using Postman or Insomnia

1. Create a new POST request
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "member",
  "position": "Dancer",
  "bio": "Passionate dancer and member of S.O.W Club"
}
```

### Using JavaScript/Fetch

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'member',
    position: 'Dancer'
  })
})
.then(res => res.json())
.then(data => console.log('Member added:', data))
.catch(error => console.error('Error:', error));
```

## Method 2: Using the Script (Recommended for Multiple Members)

1. Navigate to the `server` directory:
```bash
cd server
```

2. Edit `scripts/addMember.js` and uncomment/modify the example code:

```javascript
const members = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'member',
    position: 'Dancer',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'leader',
    position: 'Club Leader',
    isActive: true
  }
];

// Add all members
Promise.all(members.map(member => addMember(member)))
  .then(() => {
    console.log('✅ All members added!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
```

3. Run the script:
```bash
node scripts/addMember.js
```

## Method 3: Using MongoDB Directly

If you have MongoDB Compass or mongo shell access:

1. Connect to your database
2. Navigate to the `members` collection
3. Insert a document:

```javascript
db.members.insertOne({
  name: "John Doe",
  email: "john.doe@example.com",
  role: "member",
  position: "Dancer",
  bio: "Passionate dancer",
  isActive: true,
  joinDate: new Date()
})
```

## Method 4: Using the Admin API (Requires Authentication)

If you're already logged in as an admin, you can use:

```bash
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "member",
    "position": "Dancer"
  }'
```

## Member Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | ✅ Yes | - | Member's full name |
| `email` | String | ✅ Yes | - | Member's email (must be unique, used for login) |
| `role` | String | No | `'member'` | One of: `'member'`, `'admin'`, `'leader'` |
| `position` | String | No | `''` | Member's position/role in the club |
| `bio` | String | No | `''` | Member's biography |
| `avatar` | String | No | `''` | URL to member's avatar image |
| `isActive` | Boolean | No | `true` | Whether the member is active |

## Role Types

- **`member`**: Regular club member (default)
- **`admin`**: Administrator with full access
- **`leader`**: Club leader with elevated permissions

## Important Notes

1. **Email must be unique**: Each member must have a unique email address
2. **Email is used for login**: The email must match the Google account email they use to sign in
3. **Case insensitive**: Emails are automatically converted to lowercase
4. **First member**: You'll need to add at least one member before anyone can log in

## Quick Start: Add Your First Admin

To get started, add yourself as an admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your-email@gmail.com",
    "role": "admin",
    "position": "Administrator"
  }'
```

Replace `your-email@gmail.com` with the email address you use for Google Sign-In.

## Troubleshooting

### "Member already exists"
- The email is already in the database
- Check existing members: `GET http://localhost:5000/api/members`

### "Database not connected"
- Make sure MongoDB is running
- Check your `server/.env` file has the correct `MONGODB_URI`
- Restart your server

### "Email is required"
- Make sure you're sending the `email` field in your request
- Check the JSON format is correct

## Example: Adding Multiple Members

Create a file `addMembers.js`:

```javascript
const { addMember } = require('./scripts/addMember');

const members = [
  { name: 'Alice', email: 'alice@example.com', role: 'member' },
  { name: 'Bob', email: 'bob@example.com', role: 'member' },
  { name: 'Charlie', email: 'charlie@example.com', role: 'leader' }
];

Promise.all(members.map(m => addMember(m)))
  .then(() => console.log('✅ All done!'))
  .catch(err => console.error('❌ Error:', err));
```

Then run: `node addMembers.js`

