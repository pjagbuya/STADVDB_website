CREATE DATABASE IF NOT EXISTS central_db;
USE central_db;

CREATE TABLE IF NOT EXISTS game (
  app_id BIGINT PRIMARY KEY,
  name MEDIUMTEXT NOT NULL,
  release_date YEAR,
  price DECIMAL(9, 2) NOT NULL,
  developers LONGTEXT NOT NULL,
  log LONGTEXT
);

-- Insert sample data for the central node
INSERT INTO game (app_id, name, release_date, price, developers, log) VALUES
(1, 'Game A', 2018, 29.99, 'Developer 1', 'Game log A'),
(2, 'Game B', 2021, 49.99, 'Developer 2', 'Game log B'),
(3, 'Game C', 2019, 39.99, 'Developer 3', 'Game log C'),
(4, 'Game D', 2022, 59.99, 'Developer 4', 'Game log D'),
(5, 'Game E', 2017, 19.99, 'Developer 5', 'Game log E'),
(6, 'Game F', 2020, 34.99, 'Developer 6', 'Game log F'),
(7, 'Game G', 2023, 69.99, 'Developer 7', 'Game log G'),
(8, 'Game H', 2016, 14.99, 'Developer 8', 'Game log H'),
(9, 'Game I', 2024, 79.99, 'Developer 9', 'Game log I'),
(10, 'Game J', 2015, 9.99, 'Developer 10', 'Game log J');
