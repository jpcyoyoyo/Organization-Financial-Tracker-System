-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 11:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contents` text DEFAULT NULL,
  `date_announced` date DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `request_message` text DEFAULT NULL,
  `decision_message` text DEFAULT NULL,
  `decision` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `attendance_user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `attendee_student_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `attendance_progress` varchar(50) DEFAULT NULL,
  `proof` varchar(255) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit`
--

CREATE TABLE `audit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

CREATE TABLE `budget` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collection`
--

CREATE TABLE `collection` (
  `id` int(11) NOT NULL,
  `collector_user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `payer_student_id` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `given_cash` decimal(10,2) DEFAULT NULL,
  `given_change` decimal(10,2) DEFAULT NULL,
  `proof` varchar(255) DEFAULT NULL,
  `reciept_id` int(11) DEFAULT NULL,
  `remit_id` int(11) DEFAULT NULL,
  `date_remitted` date DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `last_treasury_balance` decimal(10,2) DEFAULT NULL,
  `current_treasury_balance` decimal(10,2) DEFAULT NULL,
  `accumulated_deposit` decimal(10,2) DEFAULT NULL,
  `accumulated_expense` decimal(10,2) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deposit`
--

CREATE TABLE `deposit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `breakdown` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `tab_group_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contents` text DEFAULT NULL,
  `generated_file` varchar(255) DEFAULT NULL,
  `scanned_file` varchar(255) DEFAULT NULL,
  `date_published` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `participation` varchar(100) DEFAULT NULL,
  `attendance_process` varchar(100) DEFAULT NULL,
  `cutoff` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `breakdown` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `tab_group_id` int(11) DEFAULT NULL,
  `proof` varchar(255) DEFAULT NULL,
  `receipt_ids` varchar(255) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `tab` varchar(100) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `contents` text DEFAULT NULL,
  `receiver` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date_issued` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date_due` date DEFAULT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `remit_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `receive_from` varchar(255) DEFAULT NULL,
  `receive_to` varchar(255) DEFAULT NULL,
  `direction` varchar(50) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `record_group`
--

CREATE TABLE `record_group` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `tab` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `remit`
--

CREATE TABLE `remit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `breakdown` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `direction` varchar(50) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `section` int(11) DEFAULT NULL,
  `deposit_id` int(11) DEFAULT NULL,
  `date_remitted` date DEFAULT NULL,
  `proof` varchar(255) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `data_filter` text DEFAULT NULL,
  `data_range` text DEFAULT NULL,
  `date_audited` date DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `audit_id` int(11) DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL,
  `number` varchar(50) DEFAULT NULL,
  `representative` int(11) DEFAULT NULL,
  `collection_balance` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `security_q`
--

CREATE TABLE `security_q` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `q1` varchar(255) DEFAULT NULL,
  `q1_answer` varchar(255) DEFAULT NULL,
  `q2` varchar(255) DEFAULT NULL,
  `q2_answer` varchar(255) DEFAULT NULL,
  `q3` varchar(255) DEFAULT NULL,
  `q3_answer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `semestral`
--

CREATE TABLE `semestral` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `acad_year` varchar(50) DEFAULT NULL,
  `term` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `theme` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `initial_password` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `security_q_id` int(11) DEFAULT NULL,
  `settings_id` int(11) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `is_login_web` tinyint(1) DEFAULT NULL,
  `is_login_mobile` tinyint(1) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT NULL,
  `e_signature` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `servicing_points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`id`, `full_name`, `student_id`, `email`, `initial_password`, `password`, `section_id`, `profile_pic`, `created_at`, `updated_at`, `security_q_id`, `settings_id`, `designation`, `is_login_web`, `is_login_mobile`, `is_online`, `e_signature`, `qr_code`, `servicing_points`) VALUES
(1, 'Admin', 'ADMIN-001', 'admin@example.com', NULL, '$2y$10$eyGNdVek3CernGfWxc46Ne2D1WfAarYVa5hdnoNXAs9/Tg3al0Cae', NULL, 'src/assets/profile_default.svg', '2025-03-18 23:23:49', '2025-03-25 22:30:57', NULL, NULL, 'President', 0, 0, 0, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_announcement_user` (`user_id`),
  ADD KEY `fk_announcement_approval` (`approval_id`),
  ADD KEY `fk_announcement_semestral` (`semestral_id`);

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_approval_user` (`user_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_attendance_user` (`attendance_user_id`),
  ADD KEY `fk_attendance_student` (`attendee_student_id`),
  ADD KEY `fk_attendance_event` (`event_id`),
  ADD KEY `fk_attendance_semestral` (`semestral_id`);

--
-- Indexes for table `audit`
--
ALTER TABLE `audit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_audit_user` (`user_id`),
  ADD KEY `fk_audit_document` (`document_id`),
  ADD KEY `fk_audit_approval` (`approval_id`),
  ADD KEY `fk_audit_semestral` (`semestral_id`);

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_budget_user` (`user_id`),
  ADD KEY `fk_budget_document` (`document_id`),
  ADD KEY `fk_budget_approval` (`approval_id`),
  ADD KEY `fk_budget_semestral` (`semestral_id`);

--
-- Indexes for table `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_collection_collector` (`collector_user_id`),
  ADD KEY `fk_collection_payer` (`payer_student_id`),
  ADD KEY `fk_collection_payment` (`payment_id`),
  ADD KEY `fk_collection_receipt` (`reciept_id`),
  ADD KEY `fk_collection_remit` (`remit_id`),
  ADD KEY `fk_collection_semestral` (`semestral_id`);

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dashboard_user` (`user_id`),
  ADD KEY `fk_dashboard_semestral` (`semestral_id`);

--
-- Indexes for table `deposit`
--
ALTER TABLE `deposit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_deposit_user` (`user_id`),
  ADD KEY `fk_deposit_record_group` (`tab_group_id`),
  ADD KEY `fk_deposit_semestral` (`semestral_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_document_user` (`user_id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_user` (`user_id`),
  ADD KEY `fk_event_approval` (`approval_id`),
  ADD KEY `fk_event_semestral` (`semestral_id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_expense_user` (`user_id`),
  ADD KEY `fk_expense_budget` (`budget_id`),
  ADD KEY `fk_expense_record_group` (`tab_group_id`),
  ADD KEY `fk_expense_semestral` (`semestral_id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_log_user` (`user_id`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_meetings_user` (`user_id`),
  ADD KEY `fk_meetings_document` (`document_id`),
  ADD KEY `fk_meetings_approval` (`approval_id`),
  ADD KEY `fk_meetings_semestral` (`semestral_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notification_user` (`user_id`),
  ADD KEY `fk_notification_receiver` (`receiver`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_user` (`user_id`),
  ADD KEY `fk_payment_budget` (`budget_id`),
  ADD KEY `fk_payment_remit` (`remit_id`),
  ADD KEY `fk_payment_approval` (`approval_id`),
  ADD KEY `fk_payment_semestral` (`semestral_id`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_receipt_user` (`user_id`),
  ADD KEY `fk_receipt_semestral` (`semestral_id`);

--
-- Indexes for table `record_group`
--
ALTER TABLE `record_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_recordgroup_user` (`user_id`);

--
-- Indexes for table `remit`
--
ALTER TABLE `remit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_remit_user` (`user_id`),
  ADD KEY `fk_remit_section` (`section`),
  ADD KEY `fk_remit_deposit` (`deposit_id`),
  ADD KEY `fk_remit_semestral` (`semestral_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_report_user` (`user_id`),
  ADD KEY `fk_report_document` (`document_id`),
  ADD KEY `fk_report_audit` (`audit_id`),
  ADD KEY `fk_report_approval` (`approval_id`),
  ADD KEY `fk_report_semestral` (`semestral_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_section_user` (`user_id`),
  ADD KEY `fk_section_semestral` (`semestral_id`),
  ADD KEY `fk_section_representative` (`representative`);

--
-- Indexes for table `security_q`
--
ALTER TABLE `security_q`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_secq_user` (`user_id`);

--
-- Indexes for table `semestral`
--
ALTER TABLE `semestral`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_semestral_user` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_settings_user` (`user_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_useraccount_section` (`section_id`),
  ADD KEY `fk_useraccount_security_q` (`security_q_id`),
  ADD KEY `fk_useraccount_settings` (`settings_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `approval`
--
ALTER TABLE `approval`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit`
--
ALTER TABLE `audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collection`
--
ALTER TABLE `collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deposit`
--
ALTER TABLE `deposit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `record_group`
--
ALTER TABLE `record_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `remit`
--
ALTER TABLE `remit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `security_q`
--
ALTER TABLE `security_q`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `semestral`
--
ALTER TABLE `semestral`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_announcement_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_announcement_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_announcement_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `approval`
--
ALTER TABLE `approval`
  ADD CONSTRAINT `fk_approval_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `fk_attendance_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_attendance_student` FOREIGN KEY (`attendee_student_id`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `fk_attendance_user` FOREIGN KEY (`attendance_user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `audit`
--
ALTER TABLE `audit`
  ADD CONSTRAINT `fk_audit_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_audit_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`),
  ADD CONSTRAINT `fk_audit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `fk_budget_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_budget_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`),
  ADD CONSTRAINT `fk_budget_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `collection`
--
ALTER TABLE `collection`
  ADD CONSTRAINT `fk_collection_collector` FOREIGN KEY (`collector_user_id`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `fk_collection_payer` FOREIGN KEY (`payer_student_id`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `fk_collection_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  ADD CONSTRAINT `fk_collection_receipt` FOREIGN KEY (`reciept_id`) REFERENCES `receipt` (`id`),
  ADD CONSTRAINT `fk_collection_remit` FOREIGN KEY (`remit_id`) REFERENCES `remit` (`id`),
  ADD CONSTRAINT `fk_collection_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`);

--
-- Constraints for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `fk_dashboard_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_dashboard_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `deposit`
--
ALTER TABLE `deposit`
  ADD CONSTRAINT `fk_deposit_record_group` FOREIGN KEY (`tab_group_id`) REFERENCES `record_group` (`id`),
  ADD CONSTRAINT `fk_deposit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_deposit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_document_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_event_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_event_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `fk_expense_budget` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `fk_expense_record_group` FOREIGN KEY (`tab_group_id`) REFERENCES `record_group` (`id`),
  ADD CONSTRAINT `fk_expense_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_expense_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `log`
--
ALTER TABLE `log`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `fk_meetings_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_meetings_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`),
  ADD CONSTRAINT `fk_meetings_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_meetings_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `fk_notification_receiver` FOREIGN KEY (`receiver`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_payment_budget` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`),
  ADD CONSTRAINT `fk_payment_remit` FOREIGN KEY (`remit_id`) REFERENCES `remit` (`id`),
  ADD CONSTRAINT `fk_payment_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `fk_receipt_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_receipt_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `record_group`
--
ALTER TABLE `record_group`
  ADD CONSTRAINT `fk_recordgroup_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `remit`
--
ALTER TABLE `remit`
  ADD CONSTRAINT `fk_remit_deposit` FOREIGN KEY (`deposit_id`) REFERENCES `deposit` (`id`),
  ADD CONSTRAINT `fk_remit_section` FOREIGN KEY (`section`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `fk_remit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_remit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`),
  ADD CONSTRAINT `fk_report_audit` FOREIGN KEY (`audit_id`) REFERENCES `audit` (`id`),
  ADD CONSTRAINT `fk_report_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`),
  ADD CONSTRAINT `fk_report_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_section_representative` FOREIGN KEY (`representative`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `fk_section_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`),
  ADD CONSTRAINT `fk_section_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `security_q`
--
ALTER TABLE `security_q`
  ADD CONSTRAINT `fk_secq_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `semestral`
--
ALTER TABLE `semestral`
  ADD CONSTRAINT `fk_semestral_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `fk_useraccount_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `fk_useraccount_security_q` FOREIGN KEY (`security_q_id`) REFERENCES `security_q` (`id`),
  ADD CONSTRAINT `fk_useraccount_settings` FOREIGN KEY (`settings_id`) REFERENCES `settings` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
