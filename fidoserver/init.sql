CREATE DATABASE IF NOT EXISTS fidodb;
use `fidodb`;
CREATE TABLE IF NOT EXISTS `user` (
  username VARCHAR(255),
  id varchar(255),
  PRIMARY key (id)
);
CREATE TABLE IF NOT EXISTS `credentials` (
  id VARCHAR(255) PRIMARY KEY,
  publicKey TEXT,
  algo VARCHAR(50),
  FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE
);
GRANT ALL PRIVILEGES ON your_database_name.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;

