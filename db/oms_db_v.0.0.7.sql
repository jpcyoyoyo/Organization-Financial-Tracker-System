-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2025 at 07:29 PM
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
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_at` timestamp NULL DEFAULT NULL,
  `date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `time_period` varchar(255) DEFAULT NULL,
  `attendances` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attendances`)),
  `status` enum('Draft','Sent for Approval','Back to Draft','Ready to Publish','Published') DEFAULT 'Draft',
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `user_id`, `created_at`, `updated_at`, `approved_at`, `date`, `name`, `description`, `time_period`, `attendances`, `status`, `approval_id`, `semestral_id`) VALUES
(1, 20, '2025-12-04 23:46:07', '2025-12-05 00:11:03', NULL, NULL, 'Doloribus officia do', 'Dolore irure tempora', NULL, NULL, 'Draft', NULL, NULL),
(2, 20, '2025-12-04 23:54:51', '2025-12-05 18:22:36', NULL, '1993-12-03', 'Fuga Voluptas in te', 'Exercitationem proid', '01:15-18:40', '[{\"date\":\"1993-04-12\",\"period_start\":\"07:44\",\"period_end\":\"15:39\",\"name\":\"Exercitationem qui r\",\"custom_name\":true,\"rows\":[{\"process\":\"In\",\"start_time\":\"02:56\",\"cutoff\":\"03:25\"},{\"process\":\"Surprise\",\"start_time\":\"03:42\",\"cutoff\":\"04:00\"},{\"process\":\"Out\",\"start_time\":\"06:33\",\"cutoff\":\"14:45\"}]}]', 'Draft', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_user` (`user_id`),
  ADD KEY `fk_event_approval` (`approval_id`),
  ADD KEY `fk_event_semestral` (`semestral_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
