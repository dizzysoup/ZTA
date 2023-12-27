
CREATE DATABASE IF NOT EXISTS fidodb;

USE fidodb;

CREATE TABLE IF NOT EXISTS credentials (
  id VARCHAR(255) PRIMARY KEY,
  publicKey TEXT,
  algorithm VARCHAR(50)
);

GRANT ALL PRIVILEGES ON your_database_name.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;