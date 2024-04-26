CREATE TABLE users (
    id BIGSERIAL,
    user_uuid uuid NOT NULL,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);

---- Enable RLS for the users table
--ALTER TABLE users ENABLE ROW LEVEL SECURITY;

---- Policies
--CREATE POLICY "Allow logged-in users to view their own user" ON users
--FOR SELECT
--USING (auth.uid() = user_uuid); -- auth.uid() is a function that returns the UUID of the currently logged in user

--CREATE POLICY "Allow logged-in users to update their own user" ON users
--FOR UPDATE
--USING (auth.uid() = user_uuid);

-- Constraints
ALTER TABLE users
ADD CONSTRAINT users_name_not_null CHECK (name IS NOT NULL),
ADD CONSTRAINT users_name_length CHECK (LENGTH(name) <= 50),
ADD CONSTRAINT users_email_unique UNIQUE (email),
ADD CONSTRAINT users_email_not_null CHECK (email IS NOT NULL),
ADD CONSTRAINT users_email_length CHECK (LENGTH(email) <= 80);


CREATE TABLE budgets (
    id BIGSERIAL,
    user_id BIGINT,
    month DATE ,
    amount DECIMAL(10, 2),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

---- Enable RLS for the budgets table
--ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

---- Policies
--CREATE POLICY "Allow logged-in users to control their own budgets" ON budgets
--FOR ALL -- SELECT, INSERT, UPDATE, DELETE
--USING (
--	user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid())
--);

-- Constraints
ALTER TABLE budgets
ADD CONSTRAINT budgets_amount_not_null CHECK (amount IS NOT NULL);


CREATE TABLE categories (
    id BIGSERIAL,
    name TEXT,
    PRIMARY KEY (id)
);

---- Enable RLS for the categories table
--ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

---- Policies
--CREATE POLICY "Allow logged-in users to view categories" ON categories
--FOR SELECT
--USING (true);

-- Constraints
ALTER TABLE categories
ADD CONSTRAINT categories_name_not_null CHECK (name IS NOT NULL),
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

---- Enable RLS for the expenses table
--ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

---- Policies
--CREATE POLICY "Allow logged-in users to view their own expenses" ON expenses
--FOR SELECT
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to insert expenses" ON expenses
--FOR INSERT
--WITH CHECK (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to update their own expenses" ON expenses
--FOR UPDATE
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to delete their own expenses" ON expenses
--FOR DELETE
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

-- Constraints
ALTER TABLE expenses
ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
ADD CONSTRAINT expenses_amount_not_null CHECK (amount IS NOT NULL),
ADD CONSTRAINT expenses_date_not_null CHECK (upload_date IS NOT NULL);


CREATE TABLE receipts (
    id BIGSERIAL,
    user_id INTEGER,
    expense_id INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id)
);

---- Enable RLS for the receipts table
--ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

---- Policies
--CREATE POLICY "Allow logged-in users to view their own receipts" ON receipts
--FOR SELECT
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to insert receipts" ON receipts
--FOR INSERT
--WITH CHECK (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to update their own receipts" ON receipts
--FOR UPDATE
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

--CREATE POLICY "Allow logged-in users to delete their own receipts" ON receipts
--FOR DELETE
--USING (user_id = (SELECT id FROM users WHERE users.user_uuid = auth.uid()));

-- Constraints
ALTER TABLE receipts
ADD CONSTRAINT receipts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
ADD CONSTRAINT receipts_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES expenses(id),
ADD CONSTRAINT receipts_upload_date_not_null CHECK (upload_date IS NOT NULL);
