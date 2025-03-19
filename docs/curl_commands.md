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
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "available": true
  }'
```

## Borrow Operations

### Borrow a Book
```bash
curl -X POST http://localhost:3000/users/1/borrow/1
```

### Return a Book with Rating
```bash
curl -X POST http://localhost:3000/users/1/return/1 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5
  }'
```

## Notes

- Replace the user ID (1) and book ID (1) in the URLs with actual IDs from your database
- All POST requests require the `Content-Type: application/json` header
- The server must be running on `localhost:3000` for these commands to work
- Make sure to properly escape any special characters in the JSON payloads when using these commands in a shell 