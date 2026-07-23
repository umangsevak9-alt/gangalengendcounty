-- Ganga Legend County / Nova One — MySQL schema for Hostinger
-- Compatible with MySQL 8.0+ and MariaDB 10.4+
-- Run once via phpMyAdmin (Import) or `mysql -u USER -p DBNAME < schema.sql`
-- Character set + collation preserve emoji / Indian language content.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =========================================================================
-- USERS + ROLES + AUTH
-- =========================================================================

CREATE TABLE IF NOT EXISTS users (
  id             CHAR(36)     NOT NULL PRIMARY KEY,
  email          VARCHAR(254) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(200) NULL,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at  DATETIME     NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id  CHAR(36)        NOT NULL,
  role     ENUM('admin','editor') NOT NULL,
  UNIQUE KEY uq_user_role (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  email      VARCHAR(254) NULL,
  full_name  VARCHAR(200) NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash CHAR(64)     NOT NULL PRIMARY KEY,
  user_id    CHAR(36)     NOT NULL,
  expires_at DATETIME     NOT NULL,
  used_at    DATETIME     NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pr_user (user_id),
  CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ip_address  VARCHAR(45)  NOT NULL,
  email       VARCHAR(254) NULL,
  succeeded   TINYINT(1)   NOT NULL DEFAULT 0,
  attempted_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_la_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SITE CONTENT
-- =========================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id               CHAR(36) NOT NULL PRIMARY KEY,
  brand_name       VARCHAR(200) NOT NULL DEFAULT '',
  brand_code       VARCHAR(100) NOT NULL DEFAULT '',
  developer        VARCHAR(200) NOT NULL DEFAULT '',
  partner          VARCHAR(200) NOT NULL DEFAULT '',
  location         VARCHAR(200) NOT NULL DEFAULT '',
  rera             VARCHAR(200) NOT NULL DEFAULT '',
  phone            VARCHAR(50)  NOT NULL DEFAULT '',
  whatsapp         VARCHAR(50)  NOT NULL DEFAULT '',
  email            VARCHAR(200) NOT NULL DEFAULT '',
  whatsapp_message VARCHAR(500) NOT NULL DEFAULT '',
  hero_image_path  VARCHAR(500) NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS amenities (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  note       TEXT NULL,
  image_path VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_amenities_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS specifications (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  group_name VARCHAR(200) NOT NULL,
  detail     TEXT NOT NULL,
  image_path VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_specs_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS video_section (
  id                   CHAR(36) NOT NULL PRIMARY KEY,
  title                VARCHAR(300) NOT NULL DEFAULT 'Experience Nova One',
  subtitle             VARCHAR(500) NULL,
  provider             ENUM('upload','youtube','vimeo') NOT NULL DEFAULT 'upload',
  video_url            VARCHAR(1000) NULL,
  video_path           VARCHAR(500)  NULL,
  poster_path          VARCHAR(500)  NULL,
  aspect_ratio         VARCHAR(10) NOT NULL DEFAULT '16/9',
  aspect_ratio_mobile  VARCHAR(10) NOT NULL DEFAULT '9/16',
  is_active            TINYINT(1) NOT NULL DEFAULT 1,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_images (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  title      VARCHAR(300) NULL,
  image_path VARCHAR(500) NOT NULL,
  aspect     VARCHAR(20) NOT NULL DEFAULT 'wide',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_gallery_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS floor_plans (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  tower      VARCHAR(100) NULL,
  area       VARCHAR(100) NULL,
  price      VARCHAR(100) NULL,
  status     VARCHAR(100) NULL,
  is_limited TINYINT(1) NOT NULL DEFAULT 0,
  image_path VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plans_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS location_settings (
  id             CHAR(36) NOT NULL PRIMARY KEY,
  heading        VARCHAR(300) NOT NULL DEFAULT "Pune's most connected luxury address.",
  subtitle       VARCHAR(500) NULL,
  address        TEXT NULL,
  map_embed_url  TEXT NULL,
  directions_url TEXT NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS location_landmarks (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  label       VARCHAR(200) NOT NULL,
  travel_time VARCHAR(100) NULL,
  icon_key    VARCHAR(50) NOT NULL DEFAULT 'MapPin',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_landmarks_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  question   VARCHAR(500) NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_faqs_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  role       VARCHAR(200) NULL,
  quote      TEXT NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  provider   ENUM('none','upload','youtube','vimeo') NOT NULL DEFAULT 'none',
  video_url  VARCHAR(1000) NULL,
  video_path VARCHAR(500)  NULL,
  image_path VARCHAR(500)  NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_test_sort (sort_order, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leads (
  id                CHAR(36) NOT NULL PRIMARY KEY,
  name              VARCHAR(200) NOT NULL,
  phone             VARCHAR(50)  NOT NULL,
  email             VARCHAR(254) NULL,
  property_interest VARCHAR(200) NULL,
  message           TEXT NULL,
  source            VARCHAR(50)  NULL DEFAULT 'contact_form',
  ip_address        VARCHAR(45) NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SEED: default admin user
-- Default email: admin@example.com
-- Default password: ChangeMe!2026    (change immediately after first login)
-- Hash generated with: password_hash('ChangeMe!2026', PASSWORD_BCRYPT)
-- =========================================================================

INSERT INTO users (id, email, password_hash, full_name, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@example.com',
  '$2y$10$e0N3PVJKY1wZ9k7YkQmMweG9qLR5cq5rQVyZoIYr4RJHRIH7wR3P.',
  'Site Admin',
  1
)
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin')
ON DUPLICATE KEY UPDATE role = role;

INSERT INTO profiles (id, email, full_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Site Admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Seed a single site_settings row so the site renders before you edit it.
INSERT INTO site_settings (id, brand_name, brand_code, developer, partner, location, phone, whatsapp, email)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Ganga Legend County',
  'Nova One',
  'Goel Ganga Corporation',
  'Unicon Group',
  'Pune, India',
  '+91 00000 00000',
  '+91 00000 00000',
  'sales@example.com'
)
ON DUPLICATE KEY UPDATE brand_name = VALUES(brand_name);

INSERT INTO location_settings (id, heading, is_active)
VALUES ('20000000-0000-0000-0000-000000000001', "Pune's most connected luxury address.", 1)
ON DUPLICATE KEY UPDATE heading = VALUES(heading);
