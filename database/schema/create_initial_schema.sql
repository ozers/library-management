-- Create the "users" table
CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)        NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    registered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "books" table
CREATE TABLE books
(
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    author         VARCHAR(100) NOT NULL,
    isbn           VARCHAR(13) UNIQUE,
    published_date DATE,
    available      BOOLEAN       DEFAULT TRUE,
    average_rating DECIMAL(3, 2) DEFAULT NULL
);

-- Create the "transactions" table
CREATE TABLE transactions
(
    transaction_id SERIAL PRIMARY KEY,
    book_id        INT NOT NULL,
    user_id        INT NOT NULL,
    borrowed_date  TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    return_date    TIMESTAMP WITHOUT TIME ZONE,
    status         VARCHAR(50)   DEFAULT 'borrowed',
    rating         DECIMAL(2, 1) DEFAULT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);