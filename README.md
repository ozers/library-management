# Library Management System

A robust Library Management System built with Node.js and PostgreSQL, designed to manage books and users within a library. The system supports operations such as borrowing and returning books, along with comprehensive user management.

## Features

- User management (create, read, update)
- Book management (add, remove, update)
- Book borrowing and returning system
- Docker containerization for easy deployment
- RESTful API architecture
- PostgreSQL database with Sequelize ORM

## Technologies 

- Node.js
- PostgreSQL
- Sequelize ORM
- Docker & Docker Compose
- Express.js

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker & Docker Compose
- Git

## Installation

1. **Clone the repository**:
   ```bash
   # Using HTTPS
   git clone https://github.com/ozers/library-management.git
   
   # Using SSH
   git clone git@github.com:ozers/library-management.git
   
   # Using GitHub CLI
   gh repo clone ozers/library-management
   ```

2. **Navigate to project directory**:
   ```bash
   cd library-management
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Start the services**:
   ```bash
   cd docker
   docker-compose up
   ```

## Database Setup

1. **Initialize the database schema**:
   - Navigate to `database/schema`
   - Run `create_initial_schema.sql` against your PostgreSQL instance

2. **Seed the database**:
   - Navigate to `database/seeds`
   - Run `1_seed_users_and_books_tables.sql` to populate initial data

## API Documentation

The API is available at `http://localhost:3000`

### Endpoints

#### Users
- `GET /users` - Fetch all users
- `GET /user/:userId` - Fetch specific user by ID
- `POST /users` - Create a new user

#### Books
- `GET /books` - Fetch all books
- `GET /book/:bookId` - Fetch specific book by ID
- `POST /books` - Add a new book

#### Book Operations
- `POST /users/{userId}/borrow/{bookId}` - Record book borrowing
- `POST /users/{userId}/return/{bookId}` - Record book return

## Project Structure

```
library-management/
├── src/                    # Source code
├── database/              # Database related files
│   ├── schema/           # Database schema
│   └── seeds/            # Seed data
├── docker/               # Docker configuration
├── tests/                # Test files
└── docs/                 # Documentation
```

## Development

To run the application in development mode:
```bash
npm run dev
```

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

For support or queries, reach out to [ozersubasi.dev@gmail.com](mailto:ozersubasi.dev@gmail.com)

