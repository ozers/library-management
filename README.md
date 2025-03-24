# Library Management System

A robust Library Management System built with Node.js and PostgreSQL, designed to manage books, users, and borrowing transactions within a library. The system follows functional programming principles and implements SOLID design patterns.

## Features

- User management (create, read)
- Book management (add, read)
- Book borrowing and returning system with ratings
- Transaction history tracking
- Environment-based configuration
- Docker containerization for easy deployment
- RESTful API architecture
- PostgreSQL database with Sequelize ORM
- Comprehensive input validation
- Type-safe development with TypeScript
- Comprehensive unit and integration tests

## Technologies 

- Node.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- Express.js
- Docker & Docker Compose
- express-validator
- dotenv
- Jest (Testing)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker & Docker Compose
- Git
- PostgreSQL client tools (psql)
- Postman (for API testing)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ozers/library-management.git
   cd library-management
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_NAME=library_db
   DB_USER=postgres
   DB_PASSWORD=postgres

   # Node Environment
   NODE_ENV=development

   # Server Configuration
   PORT=3000
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the services**:

   Development mode:
   ```bash
   # Build and start development containers
   npm run docker:build:dev
   npm run docker:up:dev

   # View logs
   npm run docker:logs:dev

   # Stop containers
   npm run docker:down:dev
   ```

   Production mode:
   ```bash
   # Build and start production containers
   npm run docker:build
   npm run docker:up

   # View logs
   npm run docker:logs

   # Stop containers
   npm run docker:down
   ```

## Testing

The project includes comprehensive unit and integration tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Test files are organized as follows:
- `__tests__/validators/`: Unit tests for request validators
- `__tests__/services/`: Unit tests for business logic services

## API Documentation

The API is available at `http://localhost:3000` (or your configured `baseUrl`)

### API Testing with Postman

1. **Import Collection and Environment**:
   - Import the collection from `docs/postman_collection.json`
   - Import environment from `docs/postman_environments.json`

2. **Select Environment**:
   - Choose the development environment from Postman's environment selector
   - Development environment configuration:
     - Base URL: `http://localhost:3000`

3. **Environment Variables**:
   The environment includes:
   - `baseUrl`: Base URL for the API
   - `testUserId`: Test user ID for API requests
   - `testBookId`: Test book ID for API requests
   - `testTransactionId`: Test transaction ID for API requests

4. **Running Tests**:
   - Collection includes basic tests for:
     - Response status validation
     - Response time checks
     - Data format validation

### API Endpoints

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

#### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Add a new book
  ```json
  {
    "name": "The Great Gatsby"
  }
  ```

#### Borrow Operations
- `POST /borrow/:userId/borrow/:bookId` - Borrow a book
- `POST /borrow/:userId/return/:bookId` - Return a book with rating
  ```json
  {
    "score": 5  // Rating between 1 and 10
  }
  ```

#### Transactions
- `GET /transactions/user/:userId` - Get user's transaction history
- `GET /transactions/:id` - Get specific transaction details

## Project Structure

```
library-management/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── validators/     # Request validation
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── __tests__/          # Test files
│   ├── validators/     # Unit tests for validators
│   └── services/       # Unit tests for services
├── docs/              # API documentation
│   ├── postman_collection.json       # Postman collection
│   └── postman_environments.json     # Development environment
├── docker/            # Docker configuration
│   ├── Dockerfile          # Production Dockerfile
│   ├── Dockerfile.dev      # Development Dockerfile
│   ├── docker-compose.yml  # Production compose file
│   ├── docker-compose.dev.yml  # Development compose file
│   └── postgres/      # PostgreSQL configuration
│       └── init/      # Database initialization scripts
└── package.json       # Project dependencies and scripts
```

## Development

### Local Development
To run the application locally:
```bash
# Start in development mode with hot-reload
npm run dev

# Start in debug mode
npm run debug

# Run tests
npm test
npm run test:watch  # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Docker Development
To run the application in Docker development mode:
```bash
# Build and start containers
npm run docker:build:dev
npm run docker:up:dev

# View logs
npm run docker:logs:dev

# Stop containers
npm run docker:down:dev
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

For support or queries, reach out to [ozersubasi.dev@gmail.com](mailto:ozersubasi.dev@gmail.com)

