
CREATE DATABASE IF NOT EXISTS fidodb;

USE fidodb;

CREATE TABLE IF NOT EXISTS user (
  username VARCHAR(255),
  id varchar(255) PRIMARY KEY
)

CREATE TABLE IF NOT EXISTS credentials (
  id VARCHAR(255) ,
  publicKey TEXT,
  algorithm VARCHAR(50)
  FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON your_database_name.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;