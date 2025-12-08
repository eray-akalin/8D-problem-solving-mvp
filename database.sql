CREATE DATABASE IF NOT EXISTS eightd_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE eightd_db;

-- problems tablosu
CREATE TABLE IF NOT EXISTS problems (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    description     TEXT NOT NULL,
    responsible_team VARCHAR(300) NOT NULL,
    status          ENUM('open', 'closed') DEFAULT 'open', 
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- root cause tree tablosu
CREATE TABLE IF NOT EXISTS causes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    problem_id      INT NOT NULL,              -- hangi probleme ait
    parent_id       INT NULL,                  -- parent cause, null ise root
    description     TEXT NOT NULL,
    is_root_cause   TINYINT(1) DEFAULT 0,      -- 1 ise root cause
    solution_action TEXT NULL,                 
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_causes_problem
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_causes_parent
        FOREIGN KEY (parent_id) REFERENCES causes(id) ON DELETE CASCADE
);