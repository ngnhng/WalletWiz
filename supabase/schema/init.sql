CREATE TABLE users (
    id BIGSERIAL,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);

ALTER TABLE users
ADD CONSTRAINT users_name_not_null CHECK (name IS NOT NULL),
ADD CONSTRAINT users_name_length CHECK (LENGTH(name) <= 50),
ADD CONSTRAINT users_email_unique UNIQUE (email),
ADD CONSTRAINT users_email_not_null CHECK (email IS NOT NULL);
ADD CONSTRAINT users_email_length CHECK (LENGTH(email) <= 80);

CREATE TABLE budgets (
    id BIGSERIAL,
    user_id BIGINT,
    month DATE ,
    amount DECIMAL(10, 2),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE budgets
ADD CONSTRAINT budgets_amount_not_null CHECK (amount IS NOT NULL);

CREATE TABLE categories (
    id BIGSERIAL,
    name TEXT,
    PRIMARY KEY (id)
);

ALTER TABLE categories
ADD CONSTRAINT categories_name_not_null CHECK (name IS NOT NULL);
ADD CONSTRAINT categories_name_length CHECK (LENGTH(name) <= 100);

CREATE TABLE expenses (
    id BIGSERIAL,
    iid BIGINT, -- external id shared with the client
    user_id INTEGER,
    category_id INTEGER,
    amount DECIMAL(10, 2),
    upload_date TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id)
);

ALTER TABLE expenses
ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
ADD CONSTRAINT expenses_amount_not_null CHECK (amount IS NOT NULL),
ADD CONSTRAINT expenses_date_not_null CHECK (date IS NOT NULL);

CREATE TABLE receipts (
    id BIGSERIAL,
    user_id INTEGER,
    expense_id INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id)
);

ALTER TABLE receipts
ADD CONSTRAINT receipts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
ADD CONSTRAINT receipts_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES expenses(id),
ADD CONSTRAINT receipts_upload_date_not_null CHECK (upload_date IS NOT NULL);
