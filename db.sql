CREATE DATABASE IF NOT EXISTS `intiria_master`;
USE `intiria_master`;

-- ======================================================================
-- PART 1: PRIMARY BACKEND CMS TABLES & ANALYTICS TRACKING
-- Used by the Live CMS Dashboard (save.php, sync_html.php, track_visitor.php)
-- ======================================================================

-- 1. CMS Backend Data Table (JSON Flat Architecture)
CREATE TABLE IF NOT EXISTS `cms_sections` (
`section_name` VARCHAR(50) PRIMARY KEY,
`data` LONGTEXT NOT NULL,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Visitor Sessions
CREATE TABLE IF NOT EXISTS `visitor_sessions` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`session_id` VARCHAR(100) NOT NULL UNIQUE,
`ip_address` VARCHAR(45),
`user_agent` TEXT,
`landing_page` VARCHAR(255),
`referrer` VARCHAR(255),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Visitor Actions
CREATE TABLE IF NOT EXISTS `visitor_actions` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`session_id` VARCHAR(100) NOT NULL,
`action_type` VARCHAR(50), 
`action_details` TEXT,     
`page_url` VARCHAR(255),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`session_id`) REFERENCES `visitor_sessions`(`session_id`) ON DELETE CASCADE
);

-- 4. User Leads / Generated Quotes
CREATE TABLE IF NOT EXISTS `quote_leads` (
`id` INT AUTO_INCREMENT PRIMARY KEY,



`id` INT AUTO_INCREMENT PRIMARY KEY,
`source_module` ENUM('frontend', 'backend') NOT NULL,
`user_identifier` VARCHAR(100), -- session_id or admin username
`activity_type` VARCHAR(100) NOT NULL, -- e.g., 'click', 'cms_save', 'page_view'
`activity_details` JSON, -- The exact payload or details of what happened
`old_data` JSON, -- What the data was before the change (for CMS edits)
`new_data` JSON, -- What the data was changed to
`edit_summary` TEXT, -- Human readable description of changes
`page_url` VARCHAR(255),
`ip_address` VARCHAR(45),
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEPARATE TABLES FOR QUOTE CONTENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS `cms_quote_content_res` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`current_data` JSON,
`previous_data` JSON,
`edit_summary` TEXT,
`edited_by` VARCHAR(100),
`ip_address` VARCHAR(45),
`last_edited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `cms_quote_content_com` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`current_data` JSON,
`previous_data` JSON,
`edit_summary` TEXT,
`edited_by` VARCHAR(100),
`ip_address` VARCHAR(45),
`last_edited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `cms_quote_content_ind` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`current_data` JSON,
`previous_data` JSON,
`edited_by` VARCHAR(100),
`ip_address` VARCHAR(45),
`last_edited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
