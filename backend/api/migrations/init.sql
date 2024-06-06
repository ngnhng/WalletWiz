CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    encrypted_password TEXT,
    token_version TEXT,
    salt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT users_firstname_not_null CHECK (firstname IS NOT NULL),
ADD CONSTRAINT users_firstname_length CHECK (LENGTH(firstname) <= 50),
ADD CONSTRAINT users_lastname_not_null CHECK (lastname IS NOT NULL),
ADD CONSTRAINT users_lastname_length CHECK (LENGTH(lastname) <= 50),
ADD CONSTRAINT users_email_unique UNIQUE (email),
ADD CONSTRAINT users_email_not_null CHECK (email IS NOT NULL),
ADD CONSTRAINT users_email_length CHECK (LENGTH(email) <= 80),
ADD CONSTRAINT users_encrypted_password_not_null CHECK (encrypted_password IS NOT NULL),
ADD CONSTRAINT users_encrypted_password_length CHECK (LENGTH(encrypted_password) <= 255),
ADD CONSTRAINT users_token_version_not_null CHECK (token_version IS NOT NULL),
ADD CONSTRAINT users_token_version_length CHECK (LENGTH(token_version) <= 100);

CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    month DATE,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE budgets
ADD CONSTRAINT budgets_amount_not_null CHECK (amount IS NOT NULL);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    category_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE categories
ADD CONSTRAINT categories_category_name_not_null CHECK (category_name IS NOT NULL),
ADD CONSTRAINT categories_category_name_length CHECK (LENGTH(category_name) <= 100);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    iid BIGINT, -- external id shared with the client
    user_id INTEGER,
    category_id INTEGER,
    amount DECIMAL(10, 2),
    upload_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

ALTER TABLE expenses
ADD CONSTRAINT expenses_amount_not_null CHECK (amount IS NOT NULL),
ADD CONSTRAINT expenses_upload_date_not_null CHECK (upload_date IS NOT NULL);

CREATE TABLE receipts (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    expense_id INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (expense_id) REFERENCES expenses(id)
);

ALTER TABLE receipts
ADD CONSTRAINT receipts_upload_date_not_null CHECK (upload_date IS NOT NULL);
