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
    name           VARCHAR(255) UNIQUE NOT NULL,
    available      BOOLEAN       DEFAULT TRUE,
    average_rating DECIMAL(3, 2) DEFAULT NULL,
    borrow_count   DECIMAL
);

-- Create the "transactions" table
CREATE TABLE transactions
(
    id          SERIAL PRIMARY KEY,
    book_id     INT NOT NULL,
    user_id     INT NOT NULL,
    borrow_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP WITHOUT TIME ZONE,
    status      VARCHAR(50)                 DEFAULT 'borrowed',
    rating      DECIMAL(2, 1)               DEFAULT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

ALTER TABLE books
    ADD COLUMN borrow_count INTEGER DEFAULT 0