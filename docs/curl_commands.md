# API Curl Commands

This document contains all the curl commands for testing the Library Management System API endpoints.

## Users

### Get All Users
```bash
curl -X GET http://localhost:3000/users
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/users/1
```

### Create New User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

## Books

### Get All Books
```bash
curl -X GET http://localhost:3000/books
```

### Get Book by ID
```bash
curl -X GET http://localhost:3000/books/1
```

### Add New Book
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "name": "The Great Gatsby"
  }'
```

## Borrow Operations

### Borrow a Book
```bash
curl -X POST http://localhost:3000/borrow/1/borrow/1
```

### Return a Book with Rating
```bash
curl -X POST http://localhost:3000/borrow/1/return/1 \
  -H "Content-Type: application/json" \
  -d '{
    "score": 5
  }'
```

## Transactions

### Get User's Transactions
```bash
curl -X GET http://localhost:3000/transactions/user/1
```

### Get Transaction by ID
```bash
curl -X GET http://localhost:3000/transactions/1
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Notes

- Replace IDs (1) in the URLs with actual IDs from your database
- All POST requests require the `Content-Type: application/json` header
- The server must be running on `localhost:3000` for these commands to work
- Make sure to properly escape any special characters in the JSON payloads when using these commands in a shell
- For testing, make sure to run `npm install` first to install all dependencies 