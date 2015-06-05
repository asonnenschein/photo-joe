CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR (25) UNIQUE,
    email VARCHAR (100) UNIQUE,
    password VARCHAR,
    lockout_enabled BOOLEAN DEFAULT FALSE,
    lockout_end_date TIMESTAMP,
    registration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_preferences (
    users_preferences_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    night_mode BOOLEAN DEFAULT FALSE,
    bio VARCHAR (500),
    public_votes BOOLEAN DEFAULT TRUE,
    public_comments BOOLEAN DEFAULT TRUE,
    allow_nsfw BOOLEAN DEFAULT TRUE,
    edited_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_login (
    users_login_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    last_login_ip VARCHAR (12),
    last_login_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_banned (
    users_banned_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id),
    banned_by_users_id INTEGER REFERENCES users(users_id),
    reason VARCHAR (150),
    banned_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
    submissions_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) DEFAULT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    private BOOLEAN DEFAULT FALSE,
    anonymous BOOLEAN,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_files (
    submissions_files_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    users_id INTEGER REFERENCES users(users_id) DEFAULT NULL,
    size VARCHAR (10),
    directory VARCHAR (255),
    hash VARCHAR (255),
    original_name VARCHAR (255),
    name VARCHAR (30),
    caption VARCHAR (5000),
    upload_ip VARCHAR (12),
    uploaded_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_comments (
    submissions_comments_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    users_id INTEGER REFERENCES users(users_id) DEFAULT NULL,
    body VARCHAR (2500),
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    anonymous BOOLEAN,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_notifications (
    users_notifications_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) DEFAULT NULL,
    submissions_comments_id INTEGER REFERENCES
        submissions_comments(submissions_comments_id),
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    notification_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_submissions_saves (
    users_submissions_saves_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    users_id INTEGER REFERENCES users(users_id),
    saved_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_submissions_votes (
    users_submissions_votes_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    users_id INTEGER REFERENCES users(users_id),
    vote VARCHAR (10),
    votes_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tags_id SERIAL PRIMARY KEY,
    name VARCHAR (50),
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions_tags (
    submissions_tags_id SERIAL PRIMARY KEY,
    submissions_id INTEGER REFERENCES submissions(submissions_id),
    tags_id INTEGER REFERENCES tags(tags_id)
);

ALTER TABLE users OWNER TO slippyimages_user;
ALTER TABLE users_login OWNER TO slippyimages_user;
ALTER TABLE users_banned OWNER TO slippyimages_user;
ALTER TABLE users_notifications OWNER TO slippyimages_user;
ALTER TABLE users_submissions_saves OWNER TO slippyimages_user;
ALTER TABLE users_submissions_votes OWNER TO slippyimages_user;
ALTER TABLE submissions OWNER TO slippyimages_user;
ALTER TABLE submissions_files OWNER TO slippyimages_user;
ALTER TABLE submissions_comments OWNER TO slippyimages_user;
ALTER TABLE tags OWNER TO slippyimages_user;
ALTER TABLE submissions_tags OWNER TO slippyimages_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO slippyimages_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO slippyimages_user;