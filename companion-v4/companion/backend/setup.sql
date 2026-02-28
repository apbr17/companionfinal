-- ============================================================
-- COMPANION DB — Schema v3
-- Run this in phpMyAdmin or: mysql -u root < setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS companion_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE companion_db;

-- ============================================================
--  DATABASE 1 — USERS
--  Everything about the people who use the site:
--  their profiles, reviews they wrote, bookings they made,
--  and payments they completed.
-- ============================================================

-- 1a. User profiles
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    aadhaar     VARCHAR(12)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    avatar_url  VARCHAR(500) DEFAULT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 1b. Reviews written by users (for events or the website)
CREATE TABLE IF NOT EXISTS reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    target_type ENUM('event','website') NOT NULL,
    target_id   VARCHAR(50)  DEFAULT NULL,  -- event ext_id; NULL for site reviews
    rating      TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(200) DEFAULT NULL,
    body        TEXT         DEFAULT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY  uq_user_review (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 1c. Booking history for users
CREATE TABLE IF NOT EXISTS bookings (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          NOT NULL,
    event_ext_id VARCHAR(50)  NOT NULL,       -- links to events.ext_id
    event_title  VARCHAR(255) NOT NULL,        -- denormalised for fast display
    seats        VARCHAR(500) DEFAULT NULL,
    ticket_count INT          DEFAULT 1,
    total_price  DECIMAL(10,2) NOT NULL,
    booking_ref  VARCHAR(20)  NOT NULL UNIQUE,
    status       ENUM('pending','confirmed','cancelled') DEFAULT 'confirmed',
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 1d. Payment history for users
CREATE TABLE IF NOT EXISTS payments (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    user_id              INT          NOT NULL,
    booking_ref          VARCHAR(20)  DEFAULT NULL,
    razorpay_order_id    VARCHAR(100) NOT NULL UNIQUE,
    razorpay_payment_id  VARCHAR(100) DEFAULT NULL,
    razorpay_signature   VARCHAR(255) DEFAULT NULL,
    amount_paise         INT          NOT NULL,   -- INR × 100
    currency             VARCHAR(10)  DEFAULT 'INR',
    status               ENUM('created','paid','failed') DEFAULT 'created',
    created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
--  DATABASE 2 — EVENTS
--  Everything about the events listed on the site:
--  title, category, venue, date, price, language, etc.
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    ext_id      VARCHAR(50)  NOT NULL UNIQUE,  -- matches mockData id
    title       VARCHAR(255) NOT NULL,
    category    ENUM('movies','concerts','sports','comedy','live') NOT NULL,
    venue       VARCHAR(255) DEFAULT NULL,
    city        VARCHAR(100) DEFAULT NULL,
    event_date  DATE         DEFAULT NULL,
    event_time  VARCHAR(20)  DEFAULT NULL,
    price       DECIMAL(10,2) DEFAULT NULL,
    language    VARCHAR(50)  DEFAULT NULL,
    genre       VARCHAR(100) DEFAULT NULL,
    rating      DECIMAL(3,1) DEFAULT NULL,
    duration    VARCHAR(30)  DEFAULT NULL,
    description TEXT         DEFAULT NULL,
    image_url   VARCHAR(500) DEFAULT NULL,
    is_active   TINYINT(1)   DEFAULT 1,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  SEED — pre-populate all 8 events from mockData
-- ============================================================

INSERT IGNORE INTO events
    (ext_id, title, category, venue, city, event_date, event_time,
     price, language, genre, rating, duration, description)
VALUES
('1','Dune: Part Three','movies',
 'PVR IMAX Phoenix','Mumbai','2026-01-25','19:00',
 450,'English','Sci-Fi, Adventure',9.2,'2h 45m',
 'The epic conclusion to the Dune saga.'),

('2','Coldplay: Music of the Spheres','concerts',
 'DY Patil Stadium','Mumbai','2026-02-15','18:30',
 2500,NULL,'Rock, Pop',NULL,'3h',
 'Experience the magic of Coldplay live!'),

('3','IPL 2026: Mumbai vs Chennai','sports',
 'Wankhede Stadium','Mumbai','2026-03-20','19:30',
 1500,NULL,'Cricket',NULL,'4h',
 'The biggest rivalry in IPL history!'),

('4','Zakir Khan Live','comedy',
 'NCPA Mumbai','Mumbai','2026-02-01','20:00',
 800,'Hindi','Stand-up Comedy',NULL,'2h',
 'Sakht launda is back!'),

('5','Arijit Singh Live in Concert','concerts',
 'JLN Stadium','Delhi','2026-02-28','19:00',
 3000,NULL,'Bollywood, Playback',NULL,'3h 30m',
 'The voice of a generation performs live.'),

('6','Pushpa 3: The Rule','movies',
 'INOX Garuda Mall','Bangalore','2026-01-28','21:00',
 350,'Telugu','Action, Drama',8.8,'3h 15m',
 'Pushpa Raj returns for the ultimate showdown.'),

('7','Prateek Kuhad: Silhouettes Tour','live',
 'Phoenix Marketcity','Bangalore','2026-02-10','20:00',
 1800,NULL,'Indie, Folk',NULL,'2h 30m',
 'Join indie sensation Prateek Kuhad.'),

('8','ISL Final 2026','sports',
 'Salt Lake Stadium','Kolkata','2026-03-15','18:00',
 1200,NULL,'Football',NULL,'2h 30m',
 'Witness the thrilling conclusion of the ISL.');
