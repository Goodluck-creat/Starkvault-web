# Starkvault Backend

Express.js backend with MongoDB, JWT authentication, and **Arweave permanent storage** using modern ES modules.

## 🚀 Quick Start

1. **Install dependencies**: `npm install`
2. **Setup environment**: `cp .env.example .env`
3. **Start MongoDB**: Make sure MongoDB is running
4. **Start server**: `npm run dev`
5. **Follow the complete setup guide**: See [ARWEAVE_SETUP_GUIDE.md](./ARWEAVE_SETUP_GUIDE.md)

## Features

- **Modern ES Modules**: Uses import/export syntax instead of require
- **JWT Authentication**: Secure cookie-based authentication with token revocation
- **Arweave Integration**: Permanent file storage on the Arweave blockchain
- **MongoDB**: Document metadata and user management
- **File Upload**: Secure file uploads with metadata generation
- **Document Hashing**: SHA-256 hashing for document integrity
- **Access Control**: Public/private document sharing
- **Permanent Storage**: Files stored forever on Arweave (pay-once model)

## 📚 Complete Setup Guide

**👉 For detailed step-by-step instructions, see [ARWEAVE_SETUP_GUIDE.md](./ARWEAVE_SETUP_GUIDE.md)**

The setup guide covers:

- Development setup (free testing)
- Production setup with real Arweave uploads
- Wallet creation and funding
- Troubleshooting common issues
- Cost estimation and monitoring

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `GET /api/auth/me` - Get current user info (requires auth)

### File Upload & Management

- `POST /api/upload/file` - Upload file to Arweave (requires auth)
- `GET /api/upload/documents` - Get user's documents with pagination (requires auth)
- `GET /api/upload/document/:id` - Get document by ID (requires auth)
- `GET /api/upload/file/:arweaveHash` - Download file from Arweave (requires auth)
- `GET /api/upload/status/:arweaveHash` - Check Arweave transaction status (requires auth)
- `DELETE /api/upload/document/:id` - Delete document from database (requires auth)

### Health Check

- `GET /api/health` - Server health check

## Quick Test Commands

### 1. Create User & Login:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login (saves cookie)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 2. Upload File:

```bash
curl -X POST http://localhost:5000/api/upload/file \
  -F "file=@/path/to/your/file.pdf" \
  -F "description=Test document" \
  -F "tags=test,document" \
  -b cookies.txt
```

### 3. List Documents:

```bash
curl -X GET http://localhost:5000/api/upload/documents -b cookies.txt
```

## Environment Variables

### Required:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `NODE_ENV` - Environment (development/production)
- `COOKIE_SECRET` - Secret for cookie signing
- `FRONTEND_URL` - Frontend URL for CORS

### Arweave Configuration:

- `ARWEAVE_HOST` - Arweave gateway host (default: arweave.net)
- `ARWEAVE_PORT` - Arweave gateway port (default: 443)
- `ARWEAVE_PROTOCOL` - Protocol (default: https)
- `ARWEAVE_WALLET_KEY` - Arweave wallet JSON key (required for production uploads)

## Development vs Production

### Development Mode (Free Testing):

- Leave `ARWEAVE_WALLET_KEY` empty
- Creates transaction IDs without real uploads
- Perfect for testing API functionality
- No AR tokens required

### Production Mode (Real Uploads):

- Requires funded Arweave wallet
- Files permanently stored on Arweave
- Costs AR tokens per upload
- See [ARWEAVE_SETUP_GUIDE.md](./ARWEAVE_SETUP_GUIDE.md) for wallet setup

## Scripts

```bash
npm run dev                    # Development server
npm run start                  # Production server
npm run generate-wallet        # Generate new Arweave wallet
npm run dev:load-env          # Dev with .env.development
npm run prod:load-env         # Prod with .env.production
```

## Why Arweave?

- **Permanent Storage**: Files stored forever (no maintenance)
- **Pay-Once Model**: Single payment vs ongoing costs
- **Decentralized**: No single point of failure
- **Immutable**: Content cannot be changed or deleted
- **Perfect for Documents**: Ideal for important document preservation
- **Direct Access**: Files accessible via `https://arweave.net/{hash}`

## Security Features

- HTTP-only cookies for JWT storage
- Token revocation on logout
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- File size limits (50MB)
- Access control for document retrieval
- CORS protection

## Important Notes

- **Permanent Storage**: Files uploaded to Arweave cannot be deleted
- **Immutable**: Content cannot be changed once uploaded
- **Public Network**: Files are on a public blockchain (use access controls)
- **Confirmation Time**: Transactions may take 5-30 minutes to confirm
- **Wallet Required**: Production uploads require funded Arweave wallet

## Support

For detailed setup instructions, troubleshooting, and examples, see:
**[ARWEAVE_SETUP_GUIDE.md](./ARWEAVE_SETUP_GUIDE.md)**
