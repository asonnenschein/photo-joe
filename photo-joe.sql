CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR (25) UNIQUE,
    email VARCHAR (100) UNIQUE,
    password VARCHAR,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE galleries (
    galleries_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    name UUID DEFAULT uuid_generate_v4() NOT NULL,
    title VARCHAR,
    description VARCHAR,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE galleries_images (
    galleries_images_id SERIAL PRIMARY KEY,
    galleries_id INTEGER REFERENCES galleries(galleries_id)
        ON DELETE CASCADE,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    size INTEGER,
    directory VARCHAR,
    original_name VARCHAR,
    name VARCHAR,
    caption VARCHAR (5000),
    cover_image BOOLEAN DEFAULT FALSE,
    order_number INTEGER,
    upload_ip VARCHAR,
    uploaded_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users OWNER TO photojoe_user;
ALTER TABLE galleries OWNER TO photojoe_user;
ALTER TABLE galleries_images OWNER TO photojoe_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO photojoe_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO photojoe_user;