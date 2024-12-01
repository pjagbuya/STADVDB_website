CREATE DATABASE IF NOT EXISTS games_pre_2020;

USE games_pre_2020;

CREATE TABLE IF NOT EXISTS game (
  app_id BIGINT PRIMARY KEY,
  name MEDIUMTEXT NOT NULL,
  release_date YEAR,
  price DECIMAL(9, 2) NOT NULL,
  developers LONGTEXT NOT NULL,
  log LONGTEXT
);

-- Insert sample data for node 2 (games before 2020)
INSERT INTO game (app_id, name, release_date, price, developers, log) VALUES
(1, 'Game A', 2018, 29.99, 'Developer 1', 'Game log A'),
(3, 'Game C', 2019, 39.99, 'Developer 3', 'Game log C'),
(5, 'Game E', 2017, 19.99, 'Developer 5', 'Game log E'),
(6, 'Game F', 2020, 34.99, 'Developer 6', 'Game log F'),
(8, 'Game H', 2016, 14.99, 'Developer 8', 'Game log H'),
(10, 'Game J', 2015, 9.99, 'Developer 10', 'Game log J');
