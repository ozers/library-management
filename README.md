# Library Management System

This project is a Library Management System designed to manage books and users within a library, allowing operations
such as borrowing and returning books, along with managing user details.

## Technologies 

- Node.js
- PostgreSQL
- Sequelize ORM
- Docker

## Installation

Follow these steps to set up and run the project:

### Prerequisites

- Node.js
- npm
- Docker

### Setup

### Setup

1. **Clone the repository** (choose one of the methods below):
   - HTTPS:
     ```bash
     git clone https://github.com/ozers/library-management.git
     ```
   - SSH:
     ```bash
     git clone git@github.com:ozers/library-management.git
     ```
   - GitHub CLI:
     ```bash
     gh repo clone ozers/library-management
     ```

2. **Navigate into the project directory**:
    ```bash
    cd library-management
    ```

3. **Install the required npm packages**:
    ```bash
    npm install
    ```

4. **Build the project**:
    ```bash
    npm run build
    ```

5. **Navigate to the Docker directory and start the services using Docker Compose**:
    ```bash
    cd docker
    docker-compose up
    ```

### Database Initialization

1. After starting the Docker services, set up the initial database schema:
   - Navigate to `database/schema` and run the SQL script `create_initial_schema.sql` against your PostgreSQL instance.

2. Seed the database:
   - Navigate to `database/seeds` and run `1_seed_users_and_books_tables.sql` to populate the users and books tables
     with initial data.

## Using the API

Once the application is running and the database is set up:

- Use the provided API Endpoints below to interact with the API.
- The collection includes predefined requests for all available API endpoints, such as retrieving users, adding new
  users, fetching book details, borrowing and returning books.

### API Endpoints

- APIs will be available on localhost:3000

Here are the endpoints available:

- `GET /users`: Fetch all users.
- `GET /user/:userId`: Fetch the specific user by userId.
- `POST /users`: Add a new user.
- `GET /books`: Fetch all books.
- `GET /book/:bookId`: Fetch the specific book by bookId.
- `POST /books`: Add a new book.
- `POST /users/{userId}/borrow/{bookId}`: Record that a user has borrowed a book.
- `POST /users/{userId}/return/{bookId}`: Record that a user has returned a book.

## Contact

For support or queries, reach out to [ozersubasi.dev@gmail.com](mailto:ozersubasi.dev@gmail.com)

