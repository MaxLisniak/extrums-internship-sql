-- Define and create tables for database
CREATE TABLE IF NOT EXISTS colors (
	color_id INT AUTO_INCREMENT PRIMARY KEY,
    color_name VARCHAR(20) NOT NULL UNIQUE,
    color_hex_code CHAR(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges (
    challenge_key CHAR(21) PRIMARY KEY,
    challenge_activity VARCHAR(100) NOT NULL,
    challenge_type VARCHAR(20) NOT NULL,
    challenge_status ENUM("0","1","2") NOT NULL DEFAULT "0",
    completed DATETIME DEFAULT NULL,
    card_color INT,
    INDEX (challenge_type, challenge_status),
    FOREIGN KEY (card_color)
        REFERENCES colors(color_id)
        ON DELETE SET NULL
);

