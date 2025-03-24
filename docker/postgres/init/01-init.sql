-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    available BOOLEAN DEFAULT true,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    borrow_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    borrow_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'borrowed',
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data
INSERT INTO users (name, email)
VALUES 
    ('John Doe', 'john.doe@example.com'),
    ('Jane Smith', 'jane.smith@example.com');

INSERT INTO books (name, available, average_rating, borrow_count)
VALUES 
    ('Sonat', true, 0.00, 0),
    ('Mimoza', true, 0.00, 0),
    ('Morana', true, 0.00, 0); 