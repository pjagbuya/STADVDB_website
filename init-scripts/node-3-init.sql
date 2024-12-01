CREATE DATABASE IF NOT EXISTS games_post_2020;

USE games_post_2020;

CREATE TABLE IF NOT EXISTS game (
  app_id BIGINT PRIMARY KEY,
  name MEDIUMTEXT NOT NULL,
  release_date YEAR,
  price DECIMAL(9, 2) NOT NULL,
  developers LONGTEXT NOT NULL,
  log LONGTEXT
);

-- Insert sample data for node 3 (games from 2020 onward)
INSERT INTO game (app_id, name, release_date, price, developers, log) VALUES
(2, 'Game B', 2021, 49.99, 'Developer 2', 'Game log B'),
(4, 'Game D', 2022, 59.99, 'Developer 4', 'Game log D'),
(6, 'Game F', 2020, 34.99, 'Developer 6', 'Game log F'),
(7, 'Game G', 2023, 69.99, 'Developer 7', 'Game log G'),
(9, 'Game I', 2024, 79.99, 'Developer 9', 'Game log I');
