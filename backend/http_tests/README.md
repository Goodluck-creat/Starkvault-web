# HTTP Test Files for Starkvault API

This directory contains HTTP test files for testing all Starkvault API endpoints. These files can be used with REST clients like VS Code's REST Client extension, IntelliJ HTTP Client, or other HTTP testing tools.

## Files Overview

### 1. `auth.http`
Tests all authentication-related endpoints:
- Health check
- User signup
- User login
- Get current user info
- User logout
- Error cases (invalid credentials, duplicate signup, etc.)

### 2. `upload.http`
Tests all file upload and document management endpoints:
- File upload to Arweave
- List user documents (with pagination and search)
- Get document by ID
- Download file from Arweave
- Check Arweave transaction status
- Delete document
- Error cases (unauthorized access, missing files, etc.)

### 3. `complete-workflow.http`
Demonstrates a complete user workflow from start to finish:
- User registration
- Authentication
- Multiple file uploads (private and public)
- Document management operations
- Search and pagination
- Cleanup and logout

### 4. `error-testing.http`
Comprehensive error testing covering:
- Authentication errors
- Upload errors
- Document access errors
- Pagination errors
- Malformed requests
- Edge cases and boundary testing

## How to Use

### With VS Code REST Client Extension

1. **Install the REST Client extension** in VS Code
2. **Open any `.http` file** in this directory
3. **Click "Send Request"** above any HTTP request
4. **View the response** in the adjacent panel

### With IntelliJ/WebStorm HTTP Client

1. **Open any `.http` file** in IntelliJ or WebStorm
2. **Click the green arrow** next to any request
3. **View results** in the HTTP Response panel

### With curl (command line)

You can also copy the requests and convert them to curl commands:

```bash
# Example: Health check
curl -X GET http://localhost:5000/api/health

# Example: Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

## Prerequisites

1. **Start the server**: Make sure your Starkvault backend is running
   ```bash
   cd backend
   npm run dev
   ```

2. **MongoDB running**: Ensure MongoDB is running and accessible

3. **Update variables**: Modify the variables at the top of each file as needed:
   - `@baseUrl` - Your server URL (default: http://localhost:5000)
   - `@testEmail` - Test user email
   - `@testPassword` - Test user password
   - `@testName` - Test user name

## Testing Workflow

### Quick Start Testing

1. **Start with `auth.http`**:
   - Test health check
   - Create a test user
   - Login to get authentication cookie

2. **Move to `upload.http`**:
   - Upload test files
   - List and manage documents
   - Test file downloads

3. **Use `complete-workflow.http`** for end-to-end testing

4. **Run `error-testing.http`** to verify error handling

### Recommended Testing Order

```
1. auth.http (requests 1-3)     → Basic setup
2. upload.http (requests 1-3)   → Basic upload functionality
3. complete-workflow.http       → Full workflow
4. error-testing.http          → Error scenarios
5. auth.http (remaining)       → Advanced auth testing
6. upload.http (remaining)     → Advanced upload testing
```

## Variables and Configuration

### Common Variables
```http
@baseUrl = http://localhost:5000
@testEmail = test@example.com
@testPassword = password123
@testName = Test User
```

### Dynamic Variables
Some requests use response data from previous requests:
- Document IDs from upload responses
- Arweave hashes from upload responses
- Authentication cookies from login

### File Uploads
The upload tests include inline file content for testing. For real file uploads, you can:

1. **Replace inline content** with actual file references
2. **Use multipart/form-data** with real file paths
3. **Modify the boundary** and content as needed

## Expected Responses

### Successful Responses
- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests (signup, upload)
- **Authentication cookies**: Set automatically by login requests

### Error Responses
- **400 Bad Request**: Validation errors, missing data
- **401 Unauthorized**: Authentication required
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate data (email, document hash)
- **500 Internal Server Error**: Server errors

## Tips for Testing

### 1. Cookie Management
- Login requests automatically set authentication cookies
- Subsequent requests use these cookies automatically
- Logout clears the authentication cookies

### 2. File Upload Testing
- Use small text files for quick testing
- Test different file types and sizes
- Verify Arweave hashes in responses

### 3. Error Testing
- Test both valid and invalid scenarios
- Verify proper error messages and status codes
- Test edge cases and boundary conditions

### 4. Pagination Testing
- Test different page sizes and numbers
- Verify total counts and page calculations
- Test search functionality with pagination

## Troubleshooting

### Common Issues

1. **Server not running**: Ensure `npm run dev` is running
2. **MongoDB not connected**: Check MongoDB connection
3. **Authentication failures**: Verify user exists and credentials are correct
4. **File upload failures**: Check file paths and permissions
5. **CORS errors**: Verify frontend URL in environment variables

### Debug Tips

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test endpoints individually** before running workflows
4. **Use the health check** to verify server connectivity

## Production Testing

For production testing:

1. **Update `@baseUrl`** to your production URL
2. **Use real Arweave wallet** for actual uploads
3. **Test with HTTPS** and production certificates
4. **Verify CORS settings** for your domain

## Security Notes

- **Never commit real credentials** to version control
- **Use test data only** for these test files
- **Rotate test passwords** regularly
- **Be careful with public documents** in testing

These test files provide comprehensive coverage of all Starkvault API functionality and should help you verify that your backend is working correctly!