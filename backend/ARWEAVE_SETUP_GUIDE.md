# Complete Arweave Upload Setup Guide

This guide will walk you through setting up Arweave uploads from development to production.

## 📋 Prerequisites

- Node.js installed
- MongoDB running
- Basic understanding of environment variables

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Environment Setup

#### For Development (Testing without real uploads):

```bash
# Copy the example environment file
cp .env.example .env

# Your .env should look like this:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/starkvault_dev
JWT_SECRET=dev_jwt_secret_key_for_development_only
NODE_ENV=development
COOKIE_SECRET=dev_cookie_secret_for_development
FRONTEND_URL=http://localhost:3000
ARWEAVE_HOST=arweave.net
ARWEAVE_PORT=443
ARWEAVE_PROTOCOL=https
ARWEAVE_WALLET_KEY=
```

**Note**: In development, leaving `ARWEAVE_WALLET_KEY` empty will create transactions without actually uploading to Arweave (saves money during testing).

### Step 3: Start the Server

```bash
npm run dev
```

Your server should start on `http://localhost:5000`

### Step 4: Test Authentication First

Before uploading files, you need to authenticate:

#### Create a User Account:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login to Get Authentication Cookie:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

This saves your authentication cookie to `cookies.txt`.

### Step 5: Test File Upload (Development Mode)

```bash
# Upload a test file
curl -X POST http://localhost:5000/api/upload/file \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/test-file.pdf" \
  -F "description=My test document" \
  -F "tags=test,document" \
  -F "isPublic=false" \
  -b cookies.txt
```

**Expected Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully to Arweave",
  "document": {
    "id": "document_id",
    "arweaveHash": "transaction_id_hash",
    "arweaveUrl": "https://arweave.net/transaction_id_hash",
    ...
  }
}
```

### Step 6: Verify Upload

```bash
# List your documents
curl -X GET http://localhost:5000/api/upload/documents \
  -b cookies.txt
```

## 🏭 Production Setup (Real Arweave Uploads)

### Step 1: Generate Arweave Wallet

```bash
npm run generate-wallet
```

This creates:

- `arweave-wallet.json` file with your wallet keys
- Console output with your wallet address

**⚠️ IMPORTANT**:

- Keep the wallet file secure and private
- Never commit it to version control
- Back it up safely

### Step 2: Fund Your Wallet

1. **Get Your Wallet Address**: From the previous step's output
2. **Buy AR Tokens**:
   - Visit [arweave.net](https://arweave.net)
   - Use exchanges like Binance, KuCoin, or Gate.io
   - Or use [ArDrive](https://ardrive.io) for small amounts

3. **Transfer AR to Your Wallet**: Send AR tokens to your wallet address

4. **Check Balance**:

```bash
# Replace YOUR_WALLET_ADDRESS with your actual address
curl https://arweave.net/wallet/YOUR_WALLET_ADDRESS/balance
```

### Step 3: Configure Production Environment

```bash
# Create production environment file
cp .env.example .env.production
```

Edit `.env.production`:

```bash
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_strong_production_secret
NODE_ENV=production
COOKIE_SECRET=your_strong_cookie_secret
FRONTEND_URL=https://yourdomain.com
ARWEAVE_HOST=arweave.net
ARWEAVE_PORT=443
ARWEAVE_PROTOCOL=https
ARWEAVE_WALLET_KEY='{"kty":"RSA","n":"...your_wallet_json_here..."}'
```

**To get the wallet JSON string**:

```bash
# Read your wallet file and copy the entire JSON
cat arweave-wallet.json
```

### Step 4: Start Production Server

```bash
npm run prod:load-env
```

### Step 5: Test Production Upload

```bash
# Same upload command as before, but now it will actually upload to Arweave
curl -X POST http://localhost:5000/api/upload/file \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/file.pdf" \
  -F "description=Production test document" \
  -F "tags=production,test" \
  -F "isPublic=false" \
  -b cookies.txt
```

### Step 6: Verify on Arweave Network

After upload, you can:

1. **Check Transaction Status**:

```bash
curl -X GET http://localhost:5000/api/upload/status/YOUR_ARWEAVE_HASH \
  -b cookies.txt
```

2. **View File Directly on Arweave**:
   - Visit: `https://arweave.net/YOUR_ARWEAVE_HASH`
   - Or use: `https://viewblock.io/arweave/tx/YOUR_ARWEAVE_HASH`

## 💰 Cost Estimation

### Current Arweave Pricing (approximate):

- **Small files** (< 1MB): ~$0.01 - $0.10
- **Medium files** (1-10MB): ~$0.10 - $1.00
- **Large files** (10-50MB): ~$1.00 - $5.00

### Factors affecting cost:

- File size (primary factor)
- Network congestion
- AR token price fluctuation

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Insufficient funds" error

```bash
# Check wallet balance
curl https://arweave.net/wallet/YOUR_WALLET_ADDRESS/balance
```

**Solution**: Add more AR tokens to your wallet

#### 2. "Invalid wallet key" error

**Solution**: Ensure your `ARWEAVE_WALLET_KEY` is valid JSON:

```bash
# Test wallet key format
node -e "console.log(JSON.parse(process.env.ARWEAVE_WALLET_KEY))"
```

#### 3. "Transaction failed" error

**Solutions**:

- Check network connectivity
- Verify wallet has sufficient balance
- Try again (network might be congested)

#### 4. File not appearing on Arweave immediately

**This is normal**: Arweave transactions can take 5-30 minutes to confirm. Check status:

```bash
curl -X GET http://localhost:5000/api/upload/status/YOUR_ARWEAVE_HASH \
  -b cookies.txt
```

### Debug Mode:

Add to your environment for detailed logging:

```bash
DEBUG=arweave:*
```

## 📊 Monitoring Uploads

### Check Transaction Status:

```bash
# Get detailed status
curl -X GET http://localhost:5000/api/upload/status/ARWEAVE_HASH \
  -b cookies.txt
```

### Response meanings:

- `confirmed: false` - Transaction pending
- `confirmed: true` - Transaction confirmed and permanent
- `numberOfConfirmations: X` - Number of confirmations (more = more secure)

## 🔐 Security Best Practices

1. **Wallet Security**:
   - Never share your wallet JSON
   - Use environment variables, not hardcoded keys
   - Backup wallet securely

2. **Access Control**:
   - Use `isPublic: false` for private documents
   - Implement proper authentication
   - Validate file types and sizes

3. **Cost Management**:
   - Set file size limits
   - Monitor wallet balance
   - Implement upload quotas per user

## 🎯 Quick Test Checklist

- [ ] Server starts without errors
- [ ] User can sign up and login
- [ ] File upload returns success response
- [ ] Document appears in user's document list
- [ ] Arweave URL is accessible (production only)
- [ ] Transaction status can be checked

## 📞 Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check Arweave network status at [arweave.net](https://arweave.net)

## 🎉 Success!

Once you see a successful upload response and can access your file via the Arweave URL, your setup is complete! Your documents are now permanently stored on the Arweave blockchain.
