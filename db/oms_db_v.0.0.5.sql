-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 10:28 PM
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(255) DEFAULT NULL,
  `type` enum('Budget','Announcement','Audit','Payment') DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `request_message` text DEFAULT NULL,
  `decision_message` text DEFAULT NULL,
  `decision` enum('Approved','Disapproved','Cancelled','') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approval`
--

INSERT INTO `approval` (`id`, `user_id`, `created_at`, `updated_at`, `name`, `type`, `relating_id`, `request_message`, `decision_message`, `decision`) VALUES
(1, 21, '2025-05-14 22:46:10', '2025-05-15 13:09:36', 'Approval for Praesentium dele', 'Budget', 1, 'idj ij jd jo jdj siojojsi joijdos joijoi jdsoj oijo doi jo jdosj io dlfnsl j,;mfs jj  jdfpj spjp jsdfjjdf kbk idj ij jd jo jdj siojojsi joijdos joijoi jdsoj oijo doi jo jdosj io dlfnsl j,;mfs jj  jdfpj spjp jsdfjjdf kbk', 'Rem nihil vel quia v', 'Approved'),
(2, 21, '2025-05-15 02:29:26', '2025-05-15 03:32:42', 'Approval for Eum placeat culpa ', 'Budget', 4, 'mindoomdoomdomomomd odko kodk okod kokd', 'Cancelled by Ad ea maiores vel mi - (23-10089) Treasurer', 'Cancelled'),
(3, 21, '2025-05-15 03:35:57', '2025-05-15 03:36:14', 'Approval for Ea autem quo delenit', 'Budget', 3, 'isnoia ooijdsj oj pjpihpk p[psahpo japjpj  jsdpajoopj padsjpjpa sdjopjopad sopj pjdsa ojopj sadpjop jdsa pj pojdsa pjpjsda ojp jasd pojpoj sadpjpj pd jpsajopj ds', 'Cancelled by Ad ea maiores vel mi - (23-10089) Treasurer', 'Cancelled'),
(4, 21, '2025-05-15 16:51:17', '2025-05-15 17:06:25', 'Approval for Eum placeat culpa ', 'Budget', 4, 'qwertyuioppasdfghjklzxcvbnm,', 'd jsoijojdsaij j oij sodjoj oij odsji oi joij oids jfoj oij osdj ', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `attendee_student_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `attendance_user_id` int(11) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `attendance_progress` varchar(50) DEFAULT NULL,
  `proof` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `description` text NOT NULL,
  `breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[{groupName: "", rows: [{ itemName: "", quantity: "", estimatedCost: "" }],},]',
  `amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('Draft','Sent for Approval','Back to Draft','Ready to Publish','Published') NOT NULL DEFAULT 'Draft',
  `include_payment` bit(1) NOT NULL DEFAULT b'0',
  `show_other_officers` bit(1) NOT NULL DEFAULT b'0',
  `document_id` int(11) DEFAULT NULL,
  `payments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '\'[{ paymentName: "", amount: "", description: "", dueDate: "" }]\'',
  `payment_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]',
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`id`, `user_id`, `created_at`, `updated_at`, `approved_at`, `published_at`, `name`, `description`, `breakdown`, `amount`, `status`, `include_payment`, `show_other_officers`, `document_id`, `payments`, `payment_ids`, `approval_id`, `semestral_id`) VALUES
(1, 21, '2025-05-13 11:19:55', '2025-05-15 16:55:52', '2025-05-15 13:13:54', NULL, 'Praesentium dele', 'dkjp p ds doij jds j jdsi j sd poi pdsi po ii ds mdson joijdsj oijj dpjopo oipodis poipoipdsipoi poidposi pipoipodispopidosi pipi pd', '[{\"groupName\":\"Corrupti laudantium\",\"rows\":[{\"itemName\":\"Error ut quia vel qu\",\"quantity\":\"309\",\"estimatedCost\":\"98\"},{\"itemName\":\"Velit ullamco do dol\",\"quantity\":\"622\",\"estimatedCost\":\"72\"},{\"itemName\":\"Accusantium officia \",\"quantity\":\"802\",\"estimatedCost\":\"50\"},{\"itemName\":\"Nostrud officiis min\",\"quantity\":\"854\",\"estimatedCost\":\"24\"}]},{\"groupName\":\"Nostrum iste nesciun\",\"rows\":[{\"itemName\":\"Voluptate qui provid\",\"quantity\":\"99\",\"estimatedCost\":\"82\"},{\"itemName\":\"Consequuntur sed com\",\"quantity\":\"920\",\"estimatedCost\":\"85\"},{\"itemName\":\"Ea dolor fuga Quaer\",\"quantity\":\"331\",\"estimatedCost\":\"52\"},{\"itemName\":\"efgb\",\"quantity\":\"45\",\"estimatedCost\":\"45\"}]}]', 508.00, 'Ready to Publish', b'0', b'0', NULL, '[{ paymentName: \"\", amount: \"\", description: \"\", dueDate: \"\" }]', '[]', 1, NULL),
(2, 21, '2025-05-14 08:45:53', '2025-05-15 16:55:48', NULL, NULL, 'Officia unde proiden', 'Voluptatum voluptate  ININININININI', '[{\"groupName\":\"\",\"rows\":[{\"itemName\":\"\",\"quantity\":\"\",\"estimatedCost\":\"\"}]}]', 0.00, 'Draft', b'1', b'1', NULL, '[{ paymentName: \"\", amount: \"\", description: \"\", dueDate: \"\" }]', '[]', NULL, NULL),
(3, 21, '2025-05-14 08:53:08', '2025-05-15 16:55:44', NULL, NULL, 'Ea autem quo delenit', 'Suscipit facere dese misaoo jsai jo uuasj iusi joi oi \n', '[{\"groupName\":\"In excepteur id nisi\",\"rows\":[{\"itemName\":\"Doloribus ex in quae\",\"quantity\":\"500\",\"estimatedCost\":\"54\"},{\"itemName\":\"Suscipit aut recusan\",\"quantity\":\"530\",\"estimatedCost\":\"50\"},{\"itemName\":\"Sit sunt id enim cor\",\"quantity\":\"660\",\"estimatedCost\":\"83\"},{\"itemName\":\"Maiores in dolores p\",\"quantity\":\"248\",\"estimatedCost\":\"24\"}]},{\"groupName\":\"Numquam quis et illu\",\"rows\":[{\"itemName\":\"Sint et tempore es\",\"quantity\":\"861\",\"estimatedCost\":\"92\"}]}]', 303.00, 'Draft', b'0', b'0', NULL, '[{ paymentName: \"\", amount: \"\", description: \"\", dueDate: \"\" }]', '[]', NULL, NULL),
(4, 21, '2025-05-15 02:17:23', '2025-05-15 17:45:54', '2025-05-15 17:06:25', '2025-05-15 17:45:54', 'Eum placeat culpa ', 'Commodi est reicien', '[{\"groupName\":\"Est aut aut porro o\",\"rows\":[{\"itemName\":\"Aut veniam corrupti\",\"quantity\":\"535\",\"estimatedCost\":\"99\"}]}]', 99.00, 'Published', b'1', b'0', NULL, '[{\"paymentName\":\"mininininininin\",\"amount\":\"12\",\"description\":\"Neque debitis invent\",\"dueDate\":\"2025-05-24T16:37\"}]', '[1]', 4, NULL);

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
  `receipt_id` int(11) DEFAULT NULL,
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
  `curruent_treasury_balance` decimal(10,2) DEFAULT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `issued_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`breakdown`)),
  `amount` decimal(10,2) DEFAULT NULL,
  `proof` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof`)),
  `status` enum('Draft','Issued') NOT NULL,
  `record_group_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deposit`
--

INSERT INTO `deposit` (`id`, `user_id`, `created_at`, `updated_at`, `issued_at`, `name`, `breakdown`, `amount`, `proof`, `status`, `record_group_id`, `semestral_id`) VALUES
(1, 21, '2025-05-05 10:18:38', '2025-05-08 06:16:51', '2025-05-06 11:10:51', 'Sed nesciunt rerum ', '[{\"breakdownName\":\"Excepturi eveniet e\",\"breakdownAmount\":\"90\"},{\"breakdownName\":\"Quam quis dolor temp\",\"breakdownAmount\":\"63\"},{\"breakdownName\":\"Dolore eu non ut lab\",\"breakdownAmount\":\"2\"}]', 155.00, '[\"1746437182140-537343010-494859602_1884546535681343_4618794311223822493_n.jpg\",\"1746437907678-648672290-494861697_3423916561078871_7741138449432006946_n.jpg\",\"1746437908159-930113470-494859602_1884546535681343_4618794311223822493_n.jpg\",\"1746437908733-951549021-494857615_584054258028043_3502617560190236376_n.jpg\",\"1746437909044-129845886-494856217_1011436884459808_5336717370222400098_n.jpg\",\"1746682100220-616690372-IMG20250423143013.jpg\",\"1746682100247-655740512-Copy of COMSOC NEW LOGO.png\",\"1746682100249-157545933-IMG_4890-removebg-preview.png\"]', 'Issued', 6, NULL),
(2, 21, '2025-05-06 09:46:30', '2025-05-06 09:46:30', '2025-05-06 09:46:30', 'dffgffffffdff', '[{\"breakdownName\":\"iiii\",\"breakdownAmount\":\"89\"},{\"breakdownName\":\"minn\",\"breakdownAmount\":\"45\"}]', 134.00, '[\"1746524773802-459711586-Copy of COMSOC NEW LOGO.png\",\"1746524777260-410564123-IMG_4890-removebg-preview.png\"]', 'Issued', 1, NULL),
(3, 21, '2025-05-06 11:22:08', '2025-05-08 03:59:04', '2025-05-06 11:25:02', 'Id illum voluptate', '[{\"breakdownName\":\"Reiciendis et ullam \",\"breakdownAmount\":\"33\"},{\"breakdownName\":\"Blanditiis velit in\",\"breakdownAmount\":\"42\"},{\"breakdownName\":\"Quia sint aspernatur\",\"breakdownAmount\":\"96\"},{\"breakdownName\":\"Dolorum cumque ducim\",\"breakdownAmount\":\"77\"}]', 248.00, '[\"1746530697840-787049110-Copy of COMSOC NEW LOGO.png\",\"1746530697842-886051071-IMG_4890-removebg-preview.png\",\"1746676684569-974120730-IMG20250423143013.jpg\"]', 'Issued', 2, NULL),
(4, 21, '2025-05-06 11:25:58', '2025-05-07 16:04:07', '2025-05-07 16:04:07', 'Magna libero quos al', '[{\"breakdownName\":\"Temporibus ea conseq\",\"breakdownAmount\":\"68.23\"}]', 68.23, '[\"1746589207293-412209131-Copy of COMSOC NEW LOGO.png\",\"1746589207295-710524243-IMG_4890-removebg-preview.png\"]', 'Issued', 5, NULL),
(8, 21, '2025-05-08 06:06:30', '2025-05-08 09:56:57', '2025-05-08 06:15:22', 'Sed voluptas cum vel', '[{\"breakdownName\":\"Vitae ratione ut exe\",\"breakdownAmount\":\"45\"}]', 45.00, '[\"1746684913362-74291913-Copy of COMSOC NEW LOGO.png\",\"1746684913362-764204455-IMG_4890-removebg-preview.png\",\"1746698116193-782737831-IMG20250423143013.jpg\"]', 'Issued', 2, NULL),
(9, 21, '2025-05-08 06:35:47', '2025-05-08 07:15:00', '2025-05-08 07:15:00', 'Maiores rerum provid', '[{\"breakdownName\":\"Odio nihil elit inc\",\"breakdownAmount\":\"65\"},{\"breakdownName\":\"Fugiat veritatis es\",\"breakdownAmount\":\"44\"},{\"breakdownName\":\"Expedita et iste eli\",\"breakdownAmount\":\"83\"}]', 192.00, '[\"1746688490067-864256809-IMG20250423143013.jpg\",\"1746688490096-168685974-Copy of COMSOC NEW LOGO.png\"]', 'Issued', 3, NULL),
(10, 21, '2025-05-08 09:57:47', '2025-05-08 10:02:56', '2025-05-08 10:02:56', 'Eius ducimus totam ', '[{\"breakdownName\":\"Consequatur a anim r\",\"breakdownAmount\":\"12\"}]', 12.00, '[\"1746698569968-169826472-Copy of COMSOC NEW LOGO.png\"]', 'Issued', 6, NULL),
(11, 21, '2025-05-08 10:08:55', '2025-05-12 17:45:01', '2025-05-08 10:49:24', 'Adipisci autem fugia', '[{\"groupName\":\"Officia cupiditate m\",\"rows\":[{\"itemName\":\"Accusamus harum quos\",\"quantity\":\"110\",\"cost\":\"2\"}],\"breakdownName\":\"Eu dolor doloremque \",\"breakdownAmount\":\"51\"},{\"breakdownName\":\"Veniam quia quaerat\",\"breakdownAmount\":\"94\"},{\"breakdownName\":\"In ipsa labore dolo\",\"breakdownAmount\":\"55\"}]', 200.00, '[\"1747014571250-587023443-Set D.png\"]', 'Issued', 1, NULL),
(12, 21, '2025-05-08 10:22:13', '2025-05-12 04:08:00', '2025-05-08 10:39:00', 'Animi consectetur ', '[{\"breakdownName\":\"Sed repudiandae est\",\"breakdownAmount\":\"60\"}]', 60.00, '[\"1746699962930-182098509-IMG20250423143013.jpg\"]', 'Issued', 5, NULL),
(17, 21, '2025-05-08 17:12:22', '2025-05-12 17:37:49', '2025-05-09 05:50:33', 'Obcaecati minim comm', '[{\"breakdownName\":\"Adipisci harum dolor\",\"breakdownAmount\":\"43\"},{\"breakdownName\":\"Libero est reprehend\",\"breakdownAmount\":\"55\"},{\"breakdownName\":\"Aut aliquid vel inci\",\"breakdownAmount\":\"43\"},{\"breakdownName\":\"Ad sit aut eum dolo\",\"breakdownAmount\":\"15\"},{\"breakdownName\":\"Perspiciatis conseq\",\"breakdownAmount\":\"95\"},{\"breakdownName\":\"Corporis molestiae v\",\"breakdownAmount\":\"39\"},{\"breakdownName\":\"Tempora quo qui nisi\",\"breakdownAmount\":\"4\"},{\"breakdownName\":\"Et sapiente quia non\",\"breakdownAmount\":\"96\"},{\"breakdownName\":\"Facere impedit qui \",\"breakdownAmount\":\"5\"},{\"breakdownName\":\"Velit culpa officii\",\"breakdownAmount\":\"31\"}]', 426.00, '[\"1746769827339-529005234-IMG20250423143013.jpg\",\"1747071469203-410204026-Set D.png\"]', 'Issued', 2, NULL);

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
  `participation` varchar(255) DEFAULT NULL,
  `attendance_process` varchar(255) DEFAULT NULL,
  `cutoff` datetime DEFAULT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `issued_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`breakdown`)),
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('Draft','Issued') NOT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `record_group_id` int(11) DEFAULT NULL,
  `proof` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`proof`)),
  `receipt_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `user_id`, `created_at`, `updated_at`, `issued_at`, `name`, `breakdown`, `amount`, `status`, `budget_id`, `record_group_id`, `proof`, `receipt_ids`, `semestral_id`) VALUES
(1, 21, '2025-05-10 02:05:39', '2025-05-10 02:08:32', NULL, 'Mollitia tempore ut', '[{\"groupName\":\"Doloribus laborum V\",\"rows\":[{\"itemName\":\"Dolorem possimus ip\",\"quantity\":\"457\",\"cost\":\"94\"}]}]', 94.00, 'Issued', NULL, 4, '[]', NULL, NULL),
(2, 21, '2025-05-10 02:54:55', '2025-05-10 02:55:56', NULL, 'Nemo magna repudiand', '[{\"groupName\":\"Ut earum magni proid\",\"rows\":[{\"itemName\":\"Id amet rerum obca\",\"quantity\":\"403\",\"cost\":\"3\"}]}]', 3.00, 'Issued', NULL, 4, '[\"1746845024051-382259471-Set D.png\"]', NULL, NULL),
(3, 21, '2025-05-10 05:31:02', '2025-05-10 05:37:47', NULL, 'Sed nihil in officii', '[{\"groupName\":\"Et voluptates aliqua\",\"rows\":[{\"itemName\":\"Voluptates ipsa ame\",\"quantity\":\"705\",\"cost\":\"58\"}]}]', 58.00, 'Issued', NULL, 4, '[\"1746854732692-814980673-Set D.png\"]', NULL, NULL),
(4, 21, '2025-05-10 05:40:32', '2025-05-10 05:44:07', NULL, 'Architecto maiores i', '[{\"groupName\":\"Voluptatibus volupta\",\"rows\":[{\"itemName\":\"Proident nisi est v\",\"quantity\":\"984\",\"cost\":\"83\"}]}]', 83.00, 'Issued', NULL, 7, '[\"1746855608558-188354193-Set D.png\"]', '[8]', NULL),
(5, 21, '2025-05-12 01:39:19', '2025-05-12 01:39:19', '2025-05-12 01:39:19', 'Quis labore voluptat', '[{\"groupName\":\"Ratione culpa volupt\",\"rows\":[{\"itemName\":\"At voluptate lorem o\",\"quantity\":\"646\",\"cost\":\"67\"}]}]', 67.00, 'Issued', NULL, 4, '[\"1747011803410-256198715-IMG20250423143013.jpg\"]', '[]', NULL),
(6, 21, '2025-05-12 01:41:09', '2025-05-13 17:24:28', '2025-05-13 17:24:28', 'Aperiam at voluptate', '[{\"groupName\":\"Tempor corporis enim\",\"rows\":[{\"itemName\":\"Dolor obcaecati cupi\",\"quantity\":\"10\",\"cost\":\"64\"},{\"itemName\":\"Dolor quam minus dol\",\"quantity\":\"982\",\"cost\":\"9\"},{\"itemName\":\"Fugiat error magnam\",\"quantity\":\"822\",\"cost\":\"14\"},{\"itemName\":\"Labore quia id praes\",\"quantity\":\"841\",\"cost\":\"43\"},{\"itemName\":\"Enim cupidatat earum\",\"quantity\":\"956\",\"cost\":\"34\"},{\"itemName\":\"Est illo aute ipsum\",\"quantity\":\"581\",\"cost\":\"78\"},{\"itemName\":\"Amet quis non assum\",\"quantity\":\"475\",\"cost\":\"73\"},{\"itemName\":\"Autem dolor minus vo\",\"quantity\":\"996\",\"cost\":\"3\"}]},{\"groupName\":\"Temporibus enim inve\",\"rows\":[{\"itemName\":\"Laboriosam laborum\",\"quantity\":\"656\",\"cost\":\"55\"},{\"itemName\":\"Suscipit consequatur\",\"quantity\":\"527\",\"cost\":\"24\"},{\"itemName\":\"A libero est et reic\",\"quantity\":\"872\",\"cost\":\"95\"},{\"itemName\":\"Sit quod adipisicin\",\"quantity\":\"277\",\"cost\":\"32\"},{\"itemName\":\"Eveniet distinctio\",\"quantity\":\"209\",\"cost\":\"74\"},{\"itemName\":\"Duis omnis exercitat\",\"quantity\":\"872\",\"cost\":\"17\"},{\"itemName\":\"Esse soluta autem et\",\"quantity\":\"430\",\"cost\":\"7\"}]},{\"groupName\":\"Vel rem vel iusto ea\",\"rows\":[{\"itemName\":\"Commodi aut ab labor\",\"quantity\":\"742\",\"cost\":\"54\"},{\"itemName\":\"Magni ratione volupt\",\"quantity\":\"71\",\"cost\":\"41\"},{\"itemName\":\"Neque illo eveniet \",\"quantity\":\"328\",\"cost\":\"18\"},{\"itemName\":\"Nobis nesciunt amet\",\"quantity\":\"644\",\"cost\":\"85\"},{\"itemName\":\"Necessitatibus imped\",\"quantity\":\"415\",\"cost\":\"34\"},{\"itemName\":\"Sint explicabo Nat\",\"quantity\":\"164\",\"cost\":\"34\"}]}]', 888.00, 'Issued', NULL, 7, '[\"1747064888417-670623364-Copy of COMSOC NEW LOGO.png\"]', '[32]', NULL),
(15, 21, '2025-05-12 19:40:20', '2025-05-13 17:27:13', '2025-05-13 17:24:40', 'Sed et recusandae V', '[{\"groupName\":\"Ipsum amet laborios\",\"rows\":[{\"itemName\":\"Placeat debitis nos\",\"quantity\":\"668\",\"cost\":\"81\"},{\"itemName\":\"Fugiat est Nam offi\",\"quantity\":\"205\",\"cost\":\"80\"},{\"itemName\":\"Consectetur numquam \",\"quantity\":\"986\",\"cost\":\"13\"},{\"itemName\":\"Laboris libero qui q\",\"quantity\":\"654\",\"cost\":\"30\"},{\"itemName\":\"Voluptatibus tempore\",\"quantity\":\"513\",\"cost\":\"31\"}]}]', 235.00, 'Issued', NULL, 7, '[\"1747078806779-714884057-Set D.png\"]', '[42]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `tab` varchar(255) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(3, 11, '2025-04-24 11:20:43', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(6, 11, '2025-04-24 11:27:07', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(15, NULL, '2025-04-24 11:40:51', 'Login', 'Login Attempt', NULL, '2', 'Processing Login', '\n        Credentials recieved. Processing Login... \n  \n        Entered credentials: \n        - Student ID: ADMIN-001\n        - Password:  Password inputed\n      '),
(16, NULL, '2025-04-24 11:40:51', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', '\n          User account retrive succussfully. Ready for password comparison.\n  \n          - User ID: 11\n        '),
(17, 11, '2025-04-24 11:40:51', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(18, NULL, '2025-04-24 11:45:43', 'Login', 'Login Attempt', NULL, '2', 'Processing Login', '\n        Credentials recieved. Processing Login... \n  \n        Entered credentials: \n        - Student ID: ADMIN-001\n        - Password:  Password inputed\n      '),
(19, NULL, '2025-04-24 11:45:43', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', '\n          User account retrive succussfully. Ready for password comparison.\n  \n          - User ID: 11\n        '),
(20, 11, '2025-04-24 11:45:43', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(21, NULL, '2025-04-24 14:05:18', 'Login', 'Login Attempt', NULL, '2', 'Processing Login', '\n        Credentials recieved. Processing Login... \n  \n        Entered credentials: \n        - Student ID: ADMIN-001\n        - Password:  Password inputed\n      '),
(22, NULL, '2025-04-24 14:05:18', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', '\n          User account retrive succussfully. Ready for password comparison.\n  \n          - User ID: 11\n        '),
(23, 11, '2025-04-24 14:05:18', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(24, NULL, '2025-04-25 04:07:13', 'Login', 'Login Attempt', NULL, '2', 'Processing Login', '\n        Credentials recieved. Processing Login... \n  \n        Entered credentials: \n        - Student ID: ADMIN-001\n        - Password:  Password inputed\n      '),
(25, NULL, '2025-04-25 04:07:13', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', '\n          User account retrive succussfully. Ready for password comparison.\n  \n          - User ID: 11\n        '),
(26, 11, '2025-04-25 04:07:14', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', '\n        Log in successful. Redirecting to dashboard.\n\n        - User ID: 11\n        - Full Name: Admin\n        - Student ID: ADMIN-001\n        - Designation: Admin\n      '),
(27, NULL, '2025-04-25 05:00:21', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(28, NULL, '2025-04-25 05:00:21', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(29, 11, '2025-04-25 05:00:21', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(30, NULL, '2025-04-25 05:00:26', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(31, NULL, '2025-04-25 05:00:26', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(32, 11, '2025-04-25 05:00:26', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(33, NULL, '2025-04-25 05:09:33', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(34, NULL, '2025-04-25 05:09:33', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(35, 11, '2025-04-25 05:09:33', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(36, NULL, '2025-04-25 05:10:00', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(37, NULL, '2025-04-25 05:10:00', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(38, 11, '2025-04-25 05:10:00', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(39, NULL, '2025-04-28 06:35:30', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-11034\n	- Password:  Password inputed'),
(40, NULL, '2025-04-28 06:35:30', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 19'),
(41, 19, '2025-04-28 06:35:30', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 19 \n	- Full Name: Id est autem laudant\n	- Student ID: 23-11034\n	- Designation: Peace Officer'),
(42, NULL, '2025-04-28 06:35:36', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(43, NULL, '2025-04-28 06:35:36', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(44, 11, '2025-04-28 06:35:36', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(45, NULL, '2025-04-28 07:08:15', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(46, NULL, '2025-04-28 07:08:15', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(47, 11, '2025-04-28 07:08:15', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(48, NULL, '2025-04-28 07:33:39', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(49, NULL, '2025-04-28 07:33:39', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(50, 11, '2025-04-28 07:33:39', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(51, NULL, '2025-04-28 07:47:21', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-11034\n	- Password:  Password inputed'),
(52, NULL, '2025-04-28 07:47:21', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 19'),
(53, 19, '2025-04-28 07:47:21', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 19 \n	- Full Name: Id est autem laudant\n	- Student ID: 23-11034\n	- Designation: Peace Officer'),
(54, NULL, '2025-04-28 08:05:10', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-11034\n	- Password:  Password inputed'),
(55, NULL, '2025-04-28 08:05:10', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 19'),
(56, 19, '2025-04-28 08:05:10', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 19 \n	- Full Name: Id est autem laudant\n	- Student ID: 23-11034\n	- Designation: Member'),
(57, NULL, '2025-04-28 08:36:02', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(58, NULL, '2025-04-28 08:36:02', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(59, 11, '2025-04-28 08:36:02', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin'),
(60, NULL, '2025-04-28 08:59:05', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(61, NULL, '2025-04-28 08:59:05', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(62, 11, '2025-04-28 08:59:05', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(63, 11, '2025-04-28 08:59:05', 'Login', 'Login Status Update', NULL, '0', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(64, NULL, '2025-04-28 09:09:53', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-11034\n	- Password:  Password inputed'),
(65, NULL, '2025-04-28 09:09:53', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 19'),
(66, 19, '2025-04-28 09:09:53', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 19 \n	- Full Name: Id est autem laudant\n	- Student ID: 23-11034\n	- Designation: Member\n	- Platform: web'),
(67, 19, '2025-04-28 09:09:53', 'Login', 'Login Status Update', NULL, '0', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 19\n	- Platform: web'),
(68, NULL, '2025-04-28 09:30:16', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(69, NULL, '2025-04-28 09:30:16', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(70, 11, '2025-04-28 09:30:16', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(71, 11, '2025-04-28 09:30:16', 'Login', 'Login Status Update', NULL, '0', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(72, NULL, '2025-04-28 15:52:30', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(73, NULL, '2025-04-28 15:52:30', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(74, 11, '2025-04-28 15:52:30', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(75, 11, '2025-04-28 15:52:30', 'Login', 'Login Status Update', NULL, '0', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(76, 11, '2025-04-28 15:53:41', 'Logout', 'Logout Attempt', NULL, '0', 'User logout successfully', 'User logout successfully.\n\n	- User ID: 11'),
(77, 11, '2025-04-28 15:53:41', 'Logout', 'Logout Attempt', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(78, NULL, '2025-04-28 15:53:43', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(79, NULL, '2025-04-28 15:53:43', 'Login', 'Login Attempt', NULL, '0', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(80, 11, '2025-04-28 15:53:43', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(81, 11, '2025-04-28 15:53:43', 'Login', 'Login Status Update', NULL, '0', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(82, 11, '2025-04-28 15:58:27', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(83, 11, '2025-04-28 15:58:27', 'Logout', 'Logout Attempt', NULL, '0', 'User logout successfully', 'User logout successfully.\n\n	- User ID: 11'),
(84, NULL, '2025-04-28 15:58:29', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(85, NULL, '2025-04-28 15:58:29', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(86, 11, '2025-04-28 15:58:29', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(87, 11, '2025-04-28 15:58:29', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(88, 11, '2025-04-28 16:12:12', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(89, 11, '2025-04-28 16:12:12', 'Logout', 'Logout Attempt', NULL, '0', 'User logout successfully', 'User logout successfully.\n\n	- User ID: 11'),
(90, NULL, '2025-04-28 16:12:14', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(91, NULL, '2025-04-28 16:12:14', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(92, 11, '2025-04-28 16:12:15', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(93, 11, '2025-04-28 16:12:15', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(94, 11, '2025-04-28 16:24:41', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(95, 11, '2025-04-28 16:24:41', 'Logout', 'Logout Attempt', NULL, '0', 'User logout successfully', 'User logout successfully.\n\n	- User ID: 11'),
(96, NULL, '2025-04-28 16:24:43', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(97, NULL, '2025-04-28 16:24:43', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(98, 11, '2025-04-28 16:24:43', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(99, 11, '2025-04-28 16:24:43', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(100, 11, '2025-04-28 16:24:46', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(101, 11, '2025-04-28 16:24:46', 'Logout', 'Logout Attempt', NULL, '0', 'User logout successfully', 'User logout successfully.\n\n	- User ID: 11'),
(102, NULL, '2025-04-28 16:24:57', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(103, NULL, '2025-04-28 16:24:57', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(104, 11, '2025-04-28 16:24:57', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(105, 11, '2025-04-28 16:24:57', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(106, NULL, '2025-04-28 16:36:16', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(107, NULL, '2025-04-28 16:36:16', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(108, 11, '2025-04-28 16:36:16', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(109, 11, '2025-04-28 16:36:16', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(110, NULL, '2025-04-28 16:50:52', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(111, NULL, '2025-04-28 16:50:52', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(112, 11, '2025-04-28 16:50:52', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(113, 11, '2025-04-28 16:50:52', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(114, 11, '2025-04-28 23:52:15', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(115, 11, '2025-04-28 23:52:15', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out', 'User logout successfully.\n\n	- User ID: 11'),
(116, NULL, '2025-04-28 23:52:17', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(117, NULL, '2025-04-28 23:52:17', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(118, 11, '2025-04-28 23:52:17', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(119, 11, '2025-04-28 23:52:17', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(120, 11, '2025-04-29 00:30:35', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(121, 11, '2025-04-29 00:30:35', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out', 'User logout successfully.\n\n	- User ID: 11'),
(122, NULL, '2025-04-29 00:30:37', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(123, NULL, '2025-04-29 00:30:37', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(124, 11, '2025-04-29 00:30:37', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(125, 11, '2025-04-29 00:30:37', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(126, 11, '2025-04-29 00:32:47', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(127, 11, '2025-04-29 00:32:47', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(128, 11, '2025-04-29 00:33:43', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(129, 11, '2025-04-29 00:33:43', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(130, NULL, '2025-04-29 00:33:56', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(131, NULL, '2025-04-29 00:33:56', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(132, 21, '2025-04-29 00:33:56', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(133, 21, '2025-04-29 00:33:56', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(134, NULL, '2025-04-29 04:26:17', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(135, NULL, '2025-04-29 04:26:17', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(136, 11, '2025-04-29 04:26:17', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(137, 11, '2025-04-29 04:26:17', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(138, NULL, '2025-04-29 04:27:15', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(139, NULL, '2025-04-29 04:27:15', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(140, 21, '2025-04-29 04:27:15', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(141, 21, '2025-04-29 04:27:15', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(142, 21, '2025-04-29 04:27:22', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(143, 21, '2025-04-29 04:27:22', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(144, 11, '2025-04-29 04:43:49', 'Fetch Online Accounts', 'Fetch Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts.'),
(145, 11, '2025-04-29 04:43:49', 'Fetch Online Accounts', 'Fetch Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts.'),
(146, 11, '2025-04-29 04:43:49', 'Fetch Online Accounts', 'Fetch Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts.\n\nCount: 1'),
(147, 11, '2025-04-29 04:43:49', 'Fetch Online Accounts', 'Fetch Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts.\n\nCount: 1'),
(148, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(149, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(150, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(151, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(152, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(153, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(154, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(155, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(156, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(157, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(158, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(159, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(160, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(161, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(162, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 140'),
(163, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(164, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 141'),
(165, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(166, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(167, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 71'),
(168, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(169, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(170, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(171, 11, '2025-04-29 04:58:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 78'),
(172, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(173, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(174, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(175, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(176, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(177, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(178, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(179, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(180, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(181, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(182, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(183, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(184, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(185, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(186, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(187, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(188, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(189, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(190, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 167'),
(191, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(192, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(193, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 174'),
(194, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 101'),
(195, 11, '2025-04-29 04:59:18', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 102'),
(196, 11, '2025-04-29 05:02:03', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(197, 11, '2025-04-29 05:02:03', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(198, NULL, '2025-04-29 05:02:07', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(199, NULL, '2025-04-29 05:02:07', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(200, 11, '2025-04-29 05:02:07', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(201, 11, '2025-04-29 05:02:07', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(202, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(203, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(204, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(205, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(206, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(207, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(208, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(209, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(210, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(211, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(212, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 194'),
(213, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(214, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(215, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(216, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(217, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(218, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 120'),
(219, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(220, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(221, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(222, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 203'),
(223, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(224, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(225, 11, '2025-04-29 05:02:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 132'),
(226, 11, '2025-04-29 05:05:47', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(227, 11, '2025-04-29 05:05:47', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(228, NULL, '2025-04-29 05:05:48', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(229, NULL, '2025-04-29 05:05:48', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(230, 11, '2025-04-29 05:05:49', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(231, 11, '2025-04-29 05:05:49', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(232, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(233, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(234, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(235, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(236, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(237, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(238, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(239, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(240, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(241, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(242, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(243, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(244, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(245, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(246, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(247, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(248, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 226'),
(249, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 152'),
(250, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(251, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(252, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(253, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(254, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 235'),
(255, 11, '2025-04-29 05:05:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 163'),
(256, 11, '2025-04-29 05:10:24', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(257, 11, '2025-04-29 05:10:24', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(258, NULL, '2025-04-29 05:10:27', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(259, NULL, '2025-04-29 05:10:27', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(260, 11, '2025-04-29 05:10:27', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(261, 11, '2025-04-29 05:10:27', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(262, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(263, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(264, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(265, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(266, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(267, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(268, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(269, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(270, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(271, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(272, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(273, 11, '2025-04-29 05:10:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(274, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(275, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(276, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(277, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 264'),
(278, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(279, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(280, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(281, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 268'),
(282, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(283, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 195'),
(284, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(285, 11, '2025-04-29 05:10:33', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 197'),
(286, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(287, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(288, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(289, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(290, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(291, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(292, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(293, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(294, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(295, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(296, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(297, 11, '2025-04-29 05:15:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 284'),
(298, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(299, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(300, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(301, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 213'),
(302, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(303, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(304, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(305, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(306, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(307, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 294'),
(308, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(309, 11, '2025-04-29 05:15:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 221'),
(310, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(311, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(312, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(313, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(314, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(315, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(316, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(317, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(318, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(319, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 306'),
(320, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(321, 11, '2025-04-29 05:15:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 233'),
(322, 11, '2025-04-29 05:16:02', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(323, 11, '2025-04-29 05:16:02', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(324, NULL, '2025-04-29 05:16:04', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(325, NULL, '2025-04-29 05:16:04', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(326, 11, '2025-04-29 05:16:04', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(327, 11, '2025-04-29 05:16:04', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(328, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(329, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(330, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(331, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(332, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(333, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(334, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(335, 11, '2025-04-29 05:16:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(336, 11, '2025-04-29 05:16:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(337, 11, '2025-04-29 05:16:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 324'),
(338, 11, '2025-04-29 05:16:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(339, 11, '2025-04-29 05:16:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 251'),
(340, 11, '2025-04-29 05:16:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(341, 11, '2025-04-29 05:16:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(342, 11, '2025-04-29 05:16:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(343, 11, '2025-04-29 05:16:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(344, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(345, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(346, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(347, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(348, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(349, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 336'),
(350, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(351, 11, '2025-04-29 05:16:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 263'),
(352, 11, '2025-04-29 05:16:28', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(353, 11, '2025-04-29 05:16:28', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(354, NULL, '2025-04-29 05:16:31', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(355, NULL, '2025-04-29 05:16:31', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(356, 11, '2025-04-29 05:16:31', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(357, 11, '2025-04-29 05:16:31', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(358, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(359, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(360, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(361, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(362, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(363, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(364, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(365, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(366, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(367, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 354'),
(368, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(369, 11, '2025-04-29 05:16:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 281'),
(370, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(371, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(372, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(373, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(374, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(375, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(376, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(377, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(378, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(379, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 366'),
(380, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(381, 11, '2025-04-29 05:16:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 293'),
(382, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(383, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(384, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(385, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(386, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(387, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(388, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(389, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(390, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(391, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 378'),
(392, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(393, 11, '2025-04-29 05:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 305'),
(394, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(395, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(396, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(397, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(398, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(399, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(400, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(401, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(402, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(403, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(404, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(405, 11, '2025-04-29 05:20:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(406, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(407, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 394'),
(408, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(409, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 321'),
(410, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(411, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(412, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(413, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(414, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(415, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 402'),
(416, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(417, 11, '2025-04-29 05:20:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 329'),
(418, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(419, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(420, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(421, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(422, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(423, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(424, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(425, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(426, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(427, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(428, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(429, 11, '2025-04-29 05:21:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 416'),
(430, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(431, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 343'),
(432, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(433, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(434, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(435, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(436, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(437, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(438, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(439, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 426'),
(440, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(441, 11, '2025-04-29 05:21:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 353'),
(442, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(443, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(444, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(445, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(446, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(447, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(448, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(449, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 361'),
(450, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(451, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(452, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(453, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(454, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(455, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(456, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(457, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(458, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(459, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 446'),
(460, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(461, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(462, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(463, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 450'),
(464, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(465, 11, '2025-04-29 05:22:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 377'),
(466, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(467, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(468, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(469, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(470, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(471, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(472, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(473, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(474, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(475, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(476, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(477, 11, '2025-04-29 05:27:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(478, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(479, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(480, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(481, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(482, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(483, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 470'),
(484, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(485, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 397'),
(486, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(487, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 474'),
(488, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(489, 11, '2025-04-29 05:27:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 401'),
(490, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(491, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(492, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(493, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(494, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(495, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(496, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(497, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(498, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(499, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(500, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(501, 11, '2025-04-29 05:32:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(502, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(503, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(504, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(505, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 492'),
(506, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(507, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 419'),
(508, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(509, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(510, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(511, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 498'),
(512, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(513, 11, '2025-04-29 05:32:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 425'),
(514, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(515, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(516, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(517, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(518, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(519, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(520, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(521, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(522, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(523, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(524, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(525, 11, '2025-04-29 05:32:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(526, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(527, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(528, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(529, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 516'),
(530, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(531, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(532, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(533, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 520'),
(534, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(535, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 447'),
(536, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(537, 11, '2025-04-29 05:32:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 449'),
(538, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(539, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(540, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(541, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(542, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(543, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(544, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(545, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(546, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(547, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(548, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(549, 11, '2025-04-29 05:36:07', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(550, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(551, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 463'),
(552, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(553, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(554, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(555, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 542'),
(556, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(557, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(558, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(559, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 546'),
(560, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(561, 11, '2025-04-29 05:36:08', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 473'),
(562, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(563, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(564, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(565, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(566, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(567, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(568, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(569, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(570, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(571, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(572, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 477'),
(573, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(574, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(575, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 555'),
(576, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(577, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(578, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(579, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(580, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(581, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(582, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(583, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(584, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 566'),
(585, 11, '2025-04-29 06:16:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 492'),
(586, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(587, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(588, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(589, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(590, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(591, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(592, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(593, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(594, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(595, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 581'),
(596, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(597, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 509'),
(598, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(599, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(600, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(601, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(602, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(603, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(604, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(605, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(606, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(607, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(608, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 590'),
(609, 11, '2025-04-29 06:18:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 516'),
(610, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(611, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(612, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(613, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(614, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(615, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(616, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(617, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(618, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(619, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(620, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(621, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(622, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(623, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(624, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 602'),
(625, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 528'),
(626, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(627, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(628, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(629, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(630, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(631, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(632, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 614'),
(633, 11, '2025-04-29 06:18:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 540'),
(634, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(635, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(636, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(637, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(638, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(639, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(640, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(641, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(642, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(643, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(644, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(645, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(646, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(647, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 634'),
(648, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(649, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(650, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 561'),
(651, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(652, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(653, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(654, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(655, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 642'),
(656, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(657, 11, '2025-04-29 06:18:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 569'),
(658, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(659, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(660, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(661, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(662, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(663, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(664, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(665, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(666, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(667, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(668, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(669, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(670, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(671, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(672, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(673, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(674, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(675, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(676, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(677, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 657'),
(678, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 583'),
(679, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(680, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 662'),
(681, 11, '2025-04-29 06:19:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 588'),
(682, 11, '2025-04-29 06:19:40', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(683, 11, '2025-04-29 06:19:40', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(684, NULL, '2025-04-29 06:19:42', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(685, NULL, '2025-04-29 06:19:42', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(686, 21, '2025-04-29 06:19:42', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(687, 21, '2025-04-29 06:19:42', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(688, 21, '2025-04-29 06:19:56', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(689, 21, '2025-04-29 06:19:56', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(690, NULL, '2025-04-29 06:20:05', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(691, NULL, '2025-04-29 06:20:05', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(692, 21, '2025-04-29 06:20:05', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(693, 21, '2025-04-29 06:20:05', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(694, 21, '2025-04-29 06:21:37', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(695, 21, '2025-04-29 06:21:37', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(696, NULL, '2025-04-29 06:21:38', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(697, NULL, '2025-04-29 06:21:38', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(698, 21, '2025-04-29 06:21:38', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(699, 21, '2025-04-29 06:21:38', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(700, 21, '2025-04-29 06:23:06', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(701, 21, '2025-04-29 06:23:06', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(702, NULL, '2025-04-29 06:23:10', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(703, NULL, '2025-04-29 06:23:10', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(704, 11, '2025-04-29 06:23:10', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(705, 11, '2025-04-29 06:23:10', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(706, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(707, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(708, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(709, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(710, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(711, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(712, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(713, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(714, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(715, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(716, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(717, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 629'),
(718, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(719, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(720, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(721, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(722, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(723, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 635'),
(724, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(725, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 712'),
(726, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(727, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(728, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(729, 11, '2025-04-29 06:23:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 716'),
(730, NULL, '2025-04-29 22:57:32', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(731, NULL, '2025-04-29 22:57:32', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(732, 21, '2025-04-29 22:57:32', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(733, 21, '2025-04-29 22:57:32', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(734, 21, '2025-04-29 23:13:00', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(735, 21, '2025-04-29 23:13:00', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(736, NULL, '2025-04-29 23:13:02', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(737, NULL, '2025-04-29 23:13:02', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(738, 11, '2025-04-29 23:13:02', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(739, 11, '2025-04-29 23:13:02', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(740, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(741, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(742, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(743, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(744, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(745, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(746, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(747, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(748, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(749, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(750, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(751, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(752, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(753, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(754, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 732'),
(755, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(756, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 16'),
(757, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(758, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(759, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(760, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(761, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(762, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 743'),
(763, 11, '2025-04-29 23:13:03', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 28'),
(764, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(765, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(766, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(767, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(768, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(769, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(770, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(771, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(772, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(773, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(774, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(775, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(776, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(777, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(778, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 757'),
(779, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(780, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 41'),
(781, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(782, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(783, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(784, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(785, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(786, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 767'),
(787, 11, '2025-04-29 23:13:06', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 52'),
(788, 11, '2025-04-29 23:13:07', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(789, 11, '2025-04-29 23:13:07', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(790, NULL, '2025-04-29 23:13:10', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(791, NULL, '2025-04-29 23:13:10', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(792, 21, '2025-04-29 23:13:10', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(793, 21, '2025-04-29 23:13:10', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(794, 21, '2025-04-29 23:58:50', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(795, 21, '2025-04-29 23:58:50', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(796, NULL, '2025-04-29 23:58:52', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(797, NULL, '2025-04-29 23:58:52', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(798, 21, '2025-04-29 23:58:52', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(799, 21, '2025-04-29 23:58:52', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(800, 21, '2025-04-30 07:13:16', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(801, 21, '2025-04-30 07:13:16', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(802, NULL, '2025-04-30 07:13:18', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(803, NULL, '2025-04-30 07:13:18', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(804, 21, '2025-04-30 07:13:18', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(805, 21, '2025-04-30 07:13:18', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(806, 21, '2025-04-30 07:34:32', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(807, 21, '2025-04-30 07:34:32', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(808, NULL, '2025-04-30 08:03:58', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(809, NULL, '2025-04-30 08:03:58', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(810, 11, '2025-04-30 08:03:58', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(811, 11, '2025-04-30 08:03:58', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(812, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(813, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(814, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(815, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(816, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(817, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(818, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(819, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 805'),
(820, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(821, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(822, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(823, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(824, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(825, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(826, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(827, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 814'),
(828, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(829, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(830, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 99'),
(831, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(832, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(833, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(834, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(835, 11, '2025-04-30 08:03:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 105'),
(836, 11, '2025-04-30 08:04:03', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(837, 11, '2025-04-30 08:04:03', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(838, NULL, '2025-04-30 08:05:04', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(839, NULL, '2025-04-30 08:05:04', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(840, 21, '2025-04-30 08:05:04', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(841, 21, '2025-04-30 08:05:04', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(842, NULL, '2025-04-30 08:12:12', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(843, NULL, '2025-04-30 08:12:12', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(844, 11, '2025-04-30 08:12:12', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(845, 11, '2025-04-30 08:12:12', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(846, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(847, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(848, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(849, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 835'),
(850, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(851, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 121'),
(852, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(853, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(854, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(855, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(856, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(857, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(858, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(859, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 846'),
(860, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(861, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 131'),
(862, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(863, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(864, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(865, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(866, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(867, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(868, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(869, 11, '2025-04-30 08:13:42', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(870, 11, '2025-04-30 08:13:44', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(871, 11, '2025-04-30 08:13:44', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(872, NULL, '2025-04-30 08:13:47', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(873, NULL, '2025-04-30 08:13:47', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(874, 21, '2025-04-30 08:13:47', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(875, 21, '2025-04-30 08:13:47', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(876, 21, '2025-04-30 08:16:14', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(877, 21, '2025-04-30 08:16:14', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(878, NULL, '2025-04-30 08:16:19', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(879, NULL, '2025-04-30 08:16:19', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(880, 21, '2025-04-30 08:16:19', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(881, 21, '2025-04-30 08:16:19', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(882, 21, '2025-04-30 08:18:27', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(883, 21, '2025-04-30 08:18:27', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(884, NULL, '2025-04-30 08:18:33', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(885, NULL, '2025-04-30 08:18:33', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(886, 21, '2025-04-30 08:18:33', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(887, 21, '2025-04-30 08:18:33', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(888, 21, '2025-04-30 08:24:00', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(889, 21, '2025-04-30 08:24:00', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(890, NULL, '2025-04-30 08:24:04', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(891, NULL, '2025-04-30 08:24:04', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(892, 11, '2025-04-30 08:24:04', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(893, 11, '2025-04-30 08:24:04', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(894, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(895, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(896, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(897, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(898, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(899, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(900, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(901, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(902, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(903, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(904, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(905, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(906, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(907, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(908, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(909, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(910, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 888'),
(911, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(912, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 172'),
(913, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 891'),
(914, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(915, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(916, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(917, 11, '2025-04-30 08:24:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 182'),
(918, 11, '2025-04-30 08:26:26', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(919, 11, '2025-04-30 08:26:26', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(920, NULL, '2025-04-30 08:26:29', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(921, NULL, '2025-04-30 08:26:29', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(922, 21, '2025-04-30 08:26:29', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(923, 21, '2025-04-30 08:26:29', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(924, NULL, '2025-04-30 08:29:37', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(925, NULL, '2025-04-30 08:29:37', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(926, 11, '2025-04-30 08:29:37', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(927, 11, '2025-04-30 08:29:37', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(928, 21, '2025-04-30 08:29:55', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(929, 21, '2025-04-30 08:29:55', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(930, NULL, '2025-04-30 08:30:00', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(931, NULL, '2025-04-30 08:30:00', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(932, 11, '2025-04-30 08:30:00', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(933, 11, '2025-04-30 08:30:00', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(934, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(935, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(936, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(937, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(938, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(939, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(940, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(941, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(942, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(943, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(944, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(945, 11, '2025-04-30 08:30:01', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(946, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(947, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(948, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(949, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 936'),
(950, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(951, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 938'),
(952, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(953, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 223'),
(954, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(955, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 225'),
(956, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(957, 11, '2025-04-30 08:30:02', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(958, 11, '2025-04-30 08:34:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(959, 11, '2025-04-30 08:34:15', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 229'),
(960, NULL, '2025-04-30 14:57:32', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(961, NULL, '2025-04-30 14:57:32', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(962, 11, '2025-04-30 14:57:32', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(963, 11, '2025-04-30 14:57:32', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(964, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(965, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(966, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(967, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(968, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(969, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(970, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(971, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(972, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(973, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(974, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(975, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(976, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(977, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(978, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 956'),
(979, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(980, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 240'),
(981, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(982, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(983, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(984, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 246'),
(985, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(986, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(987, 11, '2025-04-30 14:57:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 969'),
(988, 11, '2025-04-30 23:37:13', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(989, 11, '2025-04-30 23:37:13', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(990, NULL, '2025-04-30 23:37:16', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(991, NULL, '2025-04-30 23:37:16', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(992, 21, '2025-04-30 23:37:16', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(993, 21, '2025-04-30 23:37:16', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(994, NULL, '2025-05-01 00:13:51', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(995, NULL, '2025-05-01 00:13:51', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(996, 11, '2025-05-01 00:13:51', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(997, 11, '2025-05-01 00:13:51', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(998, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(999, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1000, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1001, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1002, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1003, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1004, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1005, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1006, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1007, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1008, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1009, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1010, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1011, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1012, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1013, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1014, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 992'),
(1015, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1016, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 19'),
(1017, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1018, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1019, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1020, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1001'),
(1021, 11, '2025-05-01 00:13:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 28'),
(1022, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1023, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1024, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1025, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1026, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1027, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1028, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1029, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1030, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1031, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1032, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1033, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1034, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1035, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1014'),
(1036, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1037, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1038, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 41'),
(1039, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1040, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1041, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1042, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1043, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1044, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1025'),
(1045, 11, '2025-05-01 00:14:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 53'),
(1046, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1047, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1048, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1049, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 5'),
(1050, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1051, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1052, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1053, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1054, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1055, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1056, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1057, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1058, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1059, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1060, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1061, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1062, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1041'),
(1063, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1064, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 67'),
(1065, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1066, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1067, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1068, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1049'),
(1069, 11, '2025-05-01 00:14:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 76'),
(1070, NULL, '2025-05-01 00:45:15', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1071, NULL, '2025-05-01 00:45:15', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1072, 11, '2025-05-01 00:45:15', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(1073, 11, '2025-05-01 00:45:15', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(1074, 11, '2025-05-01 00:45:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1075, 11, '2025-05-01 00:45:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1076, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1077, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1078, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1079, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1080, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1081, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1082, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1083, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1084, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1085, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1086, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1069'),
(1087, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 95'),
(1088, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1089, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1090, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1091, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1092, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1093, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1094, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1095, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1096, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1082'),
(1097, 11, '2025-05-01 00:45:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 108'),
(1098, 11, '2025-05-01 00:45:25', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(1099, 11, '2025-05-01 00:45:25', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(1100, NULL, '2025-05-01 00:45:37', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1101, NULL, '2025-05-01 00:45:37', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1102, 11, '2025-05-01 00:45:37', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(1103, 11, '2025-05-01 00:45:37', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(1104, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1105, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1106, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1107, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1108, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1109, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1110, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1111, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1112, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1113, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1114, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1115, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1097'),
(1116, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 124'),
(1117, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1118, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1119, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1120, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1121, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1122, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1123, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1124, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1125, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1126, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1110'),
(1127, 11, '2025-05-01 00:45:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 136'),
(1128, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1129, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1130, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1131, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1132, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1133, 11, '2025-05-01 00:52:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1134, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1135, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1136, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 6'),
(1137, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1138, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1139, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1140, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1141, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1142, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1143, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 0'),
(1144, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(1145, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1146, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1147, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1132'),
(1148, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 158'),
(1149, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1134'),
(1150, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1151, 11, '2025-05-01 00:52:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 163'),
(1152, 21, '2025-05-01 03:20:35', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1153, 21, '2025-05-01 03:20:35', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1154, NULL, '2025-05-01 03:20:52', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1155, NULL, '2025-05-01 03:20:52', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1156, 21, '2025-05-01 03:20:52', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(1157, 21, '2025-05-01 03:20:52', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1158, 21, '2025-05-01 03:22:51', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1159, 21, '2025-05-01 03:22:51', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1160, NULL, '2025-05-01 03:26:17', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1161, NULL, '2025-05-01 03:26:17', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1162, 21, '2025-05-01 03:26:17', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(1163, 21, '2025-05-01 03:26:17', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1164, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1165, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 7'),
(1166, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1167, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1168, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1169, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1170, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1171, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1172, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1173, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1174, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1175, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1162'),
(1176, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1177, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 189'),
(1178, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1179, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 7'),
(1180, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1181, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1182, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1183, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1184, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1185, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1172'),
(1186, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1187, 11, '2025-05-01 03:30:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 199'),
(1188, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1189, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1190, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1191, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1192, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1193, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1194, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1195, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1196, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1197, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1198, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1199, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1200, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1201, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1202, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1180'),
(1203, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1204, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 206'),
(1205, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1206, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 209'),
(1207, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1208, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1209, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1210, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1211, 11, '2025-05-01 03:54:45', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1193'),
(1212, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1213, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1214, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1215, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1216, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1217, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1218, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1219, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1220, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1221, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1222, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1223, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1224, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1225, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1226, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1227, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1228, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1206'),
(1229, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1230, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 232'),
(1231, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1232, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1233, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1234, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1215'),
(1235, 11, '2025-05-01 03:55:31', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 242'),
(1236, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1237, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1238, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1239, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1240, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1241, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1242, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1243, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1244, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1245, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1246, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1247, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1248, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1249, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1250, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1230'),
(1251, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1252, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 256'),
(1253, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1254, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1255, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1256, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1257, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1258, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1239'),
(1259, 11, '2025-05-01 03:58:38', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 267'),
(1260, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1261, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1262, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1263, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1264, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1265, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1266, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1267, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1268, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1269, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1270, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1271, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1272, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1273, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1274, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1254'),
(1275, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1276, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 280'),
(1277, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1278, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1279, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1280, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1281, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1282, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1263'),
(1283, 11, '2025-05-01 03:58:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 290'),
(1284, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1285, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1286, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1287, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1288, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1289, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1290, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1291, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1292, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1293, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1294, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1295, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1296, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1297, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1298, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1276'),
(1299, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1300, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 302'),
(1301, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1302, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1303, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1304, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1305, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1306, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1287'),
(1307, 11, '2025-05-01 03:58:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 314'),
(1308, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1309, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1310, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1311, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1312, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1313, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1314, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1315, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1316, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1317, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1318, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1319, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1320, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1321, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1322, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1323, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1324, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1302'),
(1325, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1326, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 328'),
(1327, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1328, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1329, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1330, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1311'),
(1331, 11, '2025-05-01 04:00:21', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 338'),
(1332, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1333, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1334, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1335, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1336, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1337, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1338, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1339, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1340, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1341, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1342, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1343, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1344, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1345, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1346, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1325'),
(1347, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1348, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 351'),
(1349, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1350, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1351, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1352, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1353, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1354, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1335'),
(1355, 11, '2025-05-01 04:00:25', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 362'),
(1356, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1357, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1358, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1359, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1360, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1361, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1362, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1363, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1364, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1365, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1366, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1367, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(1368, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1369, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1370, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1371, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1372, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1349'),
(1373, 11, '2025-05-01 04:00:27', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1374, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 377'),
(1375, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1376, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1377, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1378, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1359'),
(1379, 11, '2025-05-01 04:00:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 386'),
(1380, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1381, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1382, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1383, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1384, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1385, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1386, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1387, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1388, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1389, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1390, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1391, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1392, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1393, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1394, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1372'),
(1395, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1396, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 398'),
(1397, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1398, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1399, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1400, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1401, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1402, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1383'),
(1403, 11, '2025-05-01 04:22:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 410'),
(1404, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1405, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1406, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1407, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1408, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1409, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1410, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1411, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1412, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1413, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1414, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1415, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1416, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1417, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1418, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1419, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1420, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1398'),
(1421, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1422, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 425'),
(1423, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1424, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1425, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1426, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1407'),
(1427, 11, '2025-05-01 04:29:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 434'),
(1428, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1429, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1430, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1431, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1432, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1433, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1434, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1435, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1436, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1437, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1438, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1439, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1440, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1441, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1442, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1421'),
(1443, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 447'),
(1444, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1445, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1446, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1447, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1448, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1449, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1450, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1432'),
(1451, 11, '2025-05-01 05:08:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 458'),
(1452, NULL, '2025-05-01 13:03:40', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1453, NULL, '2025-05-01 13:03:40', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1454, 21, '2025-05-01 13:03:40', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1455, 21, '2025-05-01 13:03:40', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1456, NULL, '2025-05-01 14:07:03', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1457, NULL, '2025-05-01 14:07:03', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1458, 11, '2025-05-01 14:07:03', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1459, 11, '2025-05-01 14:07:03', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1460, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1461, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1462, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1463, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1464, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1465, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1466, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1467, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1468, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1469, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1470, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1471, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1472, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1473, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1474, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1475, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1476, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1456'),
(1477, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1478, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 482'),
(1479, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1480, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1481, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1482, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1463'),
(1483, 11, '2025-05-01 14:07:04', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 490'),
(1484, 11, '2025-05-01 14:07:22', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1485, 11, '2025-05-01 14:07:22', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(1486, NULL, '2025-05-01 14:07:22', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1487, NULL, '2025-05-01 14:07:22', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1488, 11, '2025-05-01 14:07:22', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1489, 11, '2025-05-01 14:07:22', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1490, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1491, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1492, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1493, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1494, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1495, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1496, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1497, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1498, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1499, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1500, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1501, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1502, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1503, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1504, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1482'),
(1505, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1506, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 508'),
(1507, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1508, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 15'),
(1509, 11, '2025-05-01 14:07:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1510, 11, '2025-05-01 14:07:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1511, 11, '2025-05-01 14:07:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1512, 11, '2025-05-01 14:07:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1493'),
(1513, 11, '2025-05-01 14:07:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 520'),
(1514, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1515, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1516, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1517, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1518, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1519, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1520, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1521, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1522, 11, '2025-05-02 01:34:19', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1523, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1524, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1525, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1526, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1527, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1528, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1506'),
(1529, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1530, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 6'),
(1531, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1532, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1533, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1534, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1535, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1536, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1517'),
(1537, 11, '2025-05-02 01:34:20', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 18'),
(1538, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1539, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1540, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1541, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1542, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1543, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1544, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1545, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1546, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1547, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1548, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1549, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1550, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1551, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1552, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1553, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1554, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1531'),
(1555, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1556, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 33'),
(1557, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1558, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1559, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1560, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1541'),
(1561, 11, '2025-05-02 01:34:41', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 42'),
(1562, 11, '2025-05-02 01:51:34', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1563, 11, '2025-05-02 01:51:34', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(1564, NULL, '2025-05-02 01:51:39', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1565, NULL, '2025-05-02 01:51:39', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1566, 11, '2025-05-02 01:51:39', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1567, 11, '2025-05-02 01:51:39', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1568, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1569, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1570, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1571, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1572, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1573, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1574, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1575, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1576, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1577, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1578, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1579, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1580, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1581, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1582, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1560'),
(1583, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1584, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 60'),
(1585, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1586, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1587, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1588, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1589, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1590, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1571');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(1591, 11, '2025-05-02 01:51:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 72'),
(1592, 11, '2025-05-02 02:25:55', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1593, 11, '2025-05-02 02:25:55', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(1594, NULL, '2025-05-02 02:25:57', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1595, NULL, '2025-05-02 02:25:57', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1596, 11, '2025-05-02 02:25:57', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1597, 11, '2025-05-02 02:25:57', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1598, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1599, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1600, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1601, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1602, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1603, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1604, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1605, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1606, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1607, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1608, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1609, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1610, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1611, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1612, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1590'),
(1613, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1614, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 90'),
(1615, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1616, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1617, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1618, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1619, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1620, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1601'),
(1621, 11, '2025-05-02 02:25:58', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 102'),
(1622, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1623, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1624, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1625, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1626, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1627, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1628, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1629, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1630, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1631, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1632, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1633, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1634, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1635, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1617'),
(1636, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1637, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1638, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 117'),
(1639, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1640, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1641, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1642, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1643, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1644, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1625'),
(1645, 11, '2025-05-02 08:17:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 129'),
(1646, NULL, '2025-05-03 21:13:22', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1647, NULL, '2025-05-03 21:13:22', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1648, 11, '2025-05-03 21:13:22', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1649, 11, '2025-05-03 21:13:22', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1650, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1651, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1652, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1653, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1654, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1655, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1656, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1657, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1658, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1659, 11, '2025-05-03 21:13:23', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1660, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1661, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1662, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1663, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1664, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1665, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1666, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1645'),
(1667, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1668, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 13'),
(1669, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1670, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1671, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1672, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1653'),
(1673, 11, '2025-05-03 21:13:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 22'),
(1674, 11, '2025-05-03 21:14:50', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1675, 11, '2025-05-03 21:14:50', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(1676, NULL, '2025-05-03 21:14:53', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1677, NULL, '2025-05-03 21:14:53', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1678, 21, '2025-05-03 21:14:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1679, 21, '2025-05-03 21:14:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1680, NULL, '2025-05-04 01:15:45', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(1681, NULL, '2025-05-04 01:15:45', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(1682, 11, '2025-05-04 01:15:45', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(1683, 11, '2025-05-04 01:15:45', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(1684, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1685, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1686, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1687, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1688, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1689, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1690, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1691, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1692, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1693, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1694, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1695, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1696, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1697, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1698, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1699, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1700, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1677'),
(1701, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1702, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 47'),
(1703, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1704, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1705, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1706, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1687'),
(1707, 11, '2025-05-04 01:15:46', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 56'),
(1708, 21, '2025-05-04 02:06:34', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1709, 21, '2025-05-04 02:06:34', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1710, NULL, '2025-05-04 02:06:40', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1711, NULL, '2025-05-04 02:06:40', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1712, 21, '2025-05-04 02:06:40', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(1713, 21, '2025-05-04 02:06:40', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1714, 21, '2025-05-04 03:23:29', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1715, 21, '2025-05-04 03:23:29', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1716, NULL, '2025-05-04 03:23:47', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1717, NULL, '2025-05-04 03:23:47', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1718, 21, '2025-05-04 03:23:47', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1719, 21, '2025-05-04 03:23:47', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1720, 21, '2025-05-04 03:25:17', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1721, 21, '2025-05-04 03:25:17', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1722, NULL, '2025-05-04 03:27:26', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1723, NULL, '2025-05-04 03:27:26', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1724, 21, '2025-05-04 03:27:26', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1725, 21, '2025-05-04 03:27:26', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1726, 21, '2025-05-04 03:30:23', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1727, 21, '2025-05-04 03:30:23', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1728, NULL, '2025-05-04 03:33:54', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1729, NULL, '2025-05-04 03:33:54', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1730, 21, '2025-05-04 03:33:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1731, 21, '2025-05-04 03:33:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1732, 21, '2025-05-04 03:34:15', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1733, 21, '2025-05-04 03:34:15', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1734, NULL, '2025-05-04 03:41:39', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1735, NULL, '2025-05-04 03:41:39', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1736, 21, '2025-05-04 03:41:39', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1737, 21, '2025-05-04 03:41:39', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1738, 21, '2025-05-04 04:05:56', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1739, 21, '2025-05-04 04:05:56', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1740, NULL, '2025-05-04 04:09:54', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1741, NULL, '2025-05-04 04:09:54', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1742, 21, '2025-05-04 04:09:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1743, 21, '2025-05-04 04:09:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1744, 21, '2025-05-04 04:10:25', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1745, 21, '2025-05-04 04:10:25', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1746, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1747, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1748, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1749, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1750, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1751, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1752, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1753, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1754, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1755, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1756, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1757, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1758, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1759, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1760, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1738'),
(1761, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1762, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 106'),
(1763, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1764, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1765, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1766, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1767, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1768, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1749'),
(1769, 11, '2025-05-04 04:22:17', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 119'),
(1770, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1771, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1772, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1773, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1774, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1775, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1776, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1777, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1778, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1779, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1780, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1781, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1782, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1783, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1784, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1763'),
(1785, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1786, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 131'),
(1787, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1788, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1789, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1790, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1791, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1792, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1773'),
(1793, 11, '2025-05-04 04:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 143'),
(1794, NULL, '2025-05-04 04:23:24', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1795, NULL, '2025-05-04 04:23:24', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1796, 21, '2025-05-04 04:23:24', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1797, 21, '2025-05-04 04:23:24', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1798, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1799, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1800, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1801, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1802, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1803, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1804, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1805, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1806, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1807, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1808, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1809, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1810, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1811, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1812, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1813, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1814, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1792'),
(1815, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1816, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 160'),
(1817, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1796');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(1818, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 164'),
(1819, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1820, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1821, 11, '2025-05-04 04:23:29', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1822, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1823, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1824, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1825, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1826, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1827, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1828, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1829, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1830, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1831, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1832, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1833, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1834, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1835, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1836, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1837, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1815'),
(1838, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1839, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1840, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 188'),
(1841, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1842, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1843, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1844, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1826'),
(1845, 11, '2025-05-04 04:41:24', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 194'),
(1846, 21, '2025-05-04 05:03:28', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1847, 21, '2025-05-04 05:03:28', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1848, NULL, '2025-05-04 05:05:16', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1849, NULL, '2025-05-04 05:05:16', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1850, 21, '2025-05-04 05:05:17', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1851, 21, '2025-05-04 05:05:17', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1852, 21, '2025-05-04 05:08:17', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1853, 21, '2025-05-04 05:08:17', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1854, NULL, '2025-05-04 05:42:54', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1855, NULL, '2025-05-04 05:42:54', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1856, 21, '2025-05-04 05:42:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1857, 21, '2025-05-04 05:42:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1858, 21, '2025-05-04 06:20:49', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1859, 21, '2025-05-04 06:20:49', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1860, NULL, '2025-05-04 06:21:07', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1861, NULL, '2025-05-04 06:21:07', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1862, 21, '2025-05-04 06:21:07', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1863, 21, '2025-05-04 06:21:07', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1864, 21, '2025-05-04 06:21:51', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1865, 21, '2025-05-04 06:21:51', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1866, NULL, '2025-05-04 06:24:36', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1867, NULL, '2025-05-04 06:24:36', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1868, 21, '2025-05-04 06:24:36', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1869, 21, '2025-05-04 06:24:36', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1870, 21, '2025-05-04 06:27:05', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1871, 21, '2025-05-04 06:27:05', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1872, NULL, '2025-05-04 06:29:42', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1873, NULL, '2025-05-04 06:29:42', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1874, 21, '2025-05-04 06:29:42', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1875, 21, '2025-05-04 06:29:42', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1876, 21, '2025-05-04 06:32:43', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1877, 21, '2025-05-04 06:32:43', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1878, NULL, '2025-05-04 14:40:57', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1879, NULL, '2025-05-04 14:40:57', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1880, 21, '2025-05-04 14:40:57', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1881, 21, '2025-05-04 14:40:57', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1882, 21, '2025-05-04 14:42:47', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1883, 21, '2025-05-04 14:42:47', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1884, NULL, '2025-05-04 14:51:54', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1885, NULL, '2025-05-04 14:51:54', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1886, 21, '2025-05-04 14:51:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1887, 21, '2025-05-04 14:51:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1888, 21, '2025-05-04 14:53:09', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1889, 21, '2025-05-04 14:53:09', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1890, NULL, '2025-05-04 14:57:50', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1891, NULL, '2025-05-04 14:57:50', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1892, 21, '2025-05-04 14:57:50', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1893, 21, '2025-05-04 14:57:50', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1894, 21, '2025-05-04 14:59:33', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1895, 21, '2025-05-04 14:59:33', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1896, NULL, '2025-05-04 15:00:56', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1897, NULL, '2025-05-04 15:00:56', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1898, 21, '2025-05-04 15:00:56', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1899, 21, '2025-05-04 15:00:56', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1900, 21, '2025-05-04 15:01:18', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1901, 21, '2025-05-04 15:01:18', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(1902, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1903, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1904, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1905, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1906, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1907, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1908, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1909, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1910, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1911, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1912, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1913, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1914, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1915, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1916, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1917, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1918, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1895'),
(1919, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1920, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 265'),
(1921, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 1'),
(1922, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 1'),
(1923, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 270'),
(1924, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1925, 11, '2025-05-04 15:02:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1907'),
(1926, NULL, '2025-05-04 15:04:32', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1927, NULL, '2025-05-04 15:04:32', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1928, 21, '2025-05-04 15:04:32', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(1929, 21, '2025-05-04 15:04:32', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(1930, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1931, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1932, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1933, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1934, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1935, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1936, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1937, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1938, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1939, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1940, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1941, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1942, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1943, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1944, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1945, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1946, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1926'),
(1947, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1948, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 11'),
(1949, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1950, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1951, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1952, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1933'),
(1953, 11, '2025-05-04 19:37:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 18'),
(1954, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1955, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1956, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1957, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1958, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1959, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1960, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1961, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1962, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1963, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1964, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1965, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1966, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1967, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1968, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1969, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1970, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1971, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1972, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1951'),
(1973, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1974, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(1975, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1956'),
(1976, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 40'),
(1977, 11, '2025-05-04 19:50:54', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 42'),
(1978, NULL, '2025-05-05 07:09:01', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1979, NULL, '2025-05-05 07:09:01', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1980, 21, '2025-05-05 07:09:01', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(1981, 21, '2025-05-05 07:09:01', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1982, NULL, '2025-05-07 03:31:42', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(1983, NULL, '2025-05-07 03:31:42', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(1984, 21, '2025-05-07 03:31:42', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(1985, 21, '2025-05-07 03:31:42', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(1986, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1987, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(1988, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1989, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(1990, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1991, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(1992, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(1993, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(1994, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(1995, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1996, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(1997, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(1998, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(1999, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2000, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2001, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2002, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2003, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2004, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1984'),
(2005, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 12'),
(2006, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2007, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2008, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1990'),
(2009, 11, '2025-05-08 04:04:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 18'),
(2010, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2011, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2012, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2013, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2014, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2015, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2016, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1998'),
(2017, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2018, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 1999'),
(2019, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2020, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2021, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2022, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2023, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2024, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2025, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2026, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 30'),
(2027, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2028, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2029, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2030, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2031, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2032, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2033, 11, '2025-05-08 06:19:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 42'),
(2034, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2035, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2036, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2037, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2038, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2039, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2040, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2041, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2042, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2043, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2044, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(2045, 21, '2025-05-08 07:23:10', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2046, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2047, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2048, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2049, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2050, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2051, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2052, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2053, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2054, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2055, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2056, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2057, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2058, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2037'),
(2059, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2060, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2061, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2062, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 66'),
(2063, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2064, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2042'),
(2065, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2066, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2067, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 74'),
(2068, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2069, 11, '2025-05-08 08:07:36', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2070, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2071, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2072, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2073, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2074, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2075, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2076, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2077, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2078, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2079, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2080, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2081, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2082, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2083, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2084, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2085, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2086, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2087, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2088, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2089, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2090, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 98'),
(2091, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2073'),
(2092, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2074'),
(2093, 11, '2025-05-08 14:38:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 102'),
(2094, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2095, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2096, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2097, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2098, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2099, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2100, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2101, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2102, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2103, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2104, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2105, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2106, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2107, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2108, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2109, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2110, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2111, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2112, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2113, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2095'),
(2114, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 123'),
(2115, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2116, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2098'),
(2117, 11, '2025-05-08 14:38:47', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 127'),
(2118, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2119, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2120, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2121, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2122, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2123, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2124, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2125, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2126, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2127, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2128, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2129, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2130, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2131, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2132, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2133, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2134, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2135, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2136, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2116'),
(2137, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 144'),
(2138, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2139, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2140, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2121'),
(2141, 11, '2025-05-08 14:58:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 150'),
(2142, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2143, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2144, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2145, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2146, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2147, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2148, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2149, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2150, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2151, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2152, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2153, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2154, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2155, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2156, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2157, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2158, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2136'),
(2159, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2160, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2161, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2162, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2163, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2144'),
(2164, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 16'),
(2165, 11, '2025-05-08 19:47:16', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 19'),
(2166, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2167, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2168, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2169, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2170, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2171, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2172, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2173, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2174, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2175, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2176, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2177, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2178, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2179, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2180, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2181, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2159'),
(2182, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2183, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2184, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2185, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2186, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2187, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2168'),
(2188, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 41'),
(2189, 11, '2025-05-08 20:07:49', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 42'),
(2190, 11, '2025-05-08 20:07:52', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2191, 11, '2025-05-08 20:07:52', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(2192, NULL, '2025-05-08 20:07:54', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2193, NULL, '2025-05-08 20:07:54', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2194, 21, '2025-05-08 20:07:54', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(2195, 21, '2025-05-08 20:07:54', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(2196, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2197, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2198, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2199, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2200, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2201, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2202, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2203, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2204, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2205, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2206, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2207, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2208, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2209, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2210, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2211, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2212, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2213, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2214, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2215, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2193'),
(2216, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2217, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 70'),
(2218, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2200'),
(2219, 11, '2025-05-09 05:49:34', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 72'),
(2220, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2221, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2222, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2223, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2224, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2225, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2226, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2227, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2228, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2229, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2230, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 83'),
(2231, 11, '2025-05-09 14:29:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2213'),
(2232, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2233, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2234, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2235, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2236, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2237, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2238, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2239, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2240, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2241, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2242, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2243, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2244, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2245, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2225'),
(2246, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2247, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2248, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 7'),
(2249, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2250, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2251, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2252, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2253, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2254, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2235'),
(2255, 11, '2025-05-09 17:45:30', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 19'),
(2256, 21, '2025-05-12 20:18:44', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2257, 21, '2025-05-12 20:18:44', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(2258, NULL, '2025-05-12 20:19:33', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10045\n	- Password:  Password inputed'),
(2259, NULL, '2025-05-12 20:19:33', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 22'),
(2260, 22, '2025-05-12 20:19:33', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 22 \n	- Full Name: Qui quis similique a\n	- Student ID: 23-10045\n	- Designation: Auditor\n	- Platform: mobile'),
(2261, 22, '2025-05-12 20:19:33', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 22\n	- Platform: mobile'),
(2262, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2263, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2264, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2265, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2266, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2267, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(2268, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2269, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2270, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2271, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2272, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2273, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2274, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2275, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2276, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2277, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2278, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2279, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2280, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 15'),
(2281, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2282, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 19'),
(2283, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2263'),
(2284, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2285, 11, '2025-05-13 05:48:11', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2267'),
(2286, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2287, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2288, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2289, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2290, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2291, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2292, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2293, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2294, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2295, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2296, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2297, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2298, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2299, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2300, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2301, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2302, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2303, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2304, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2281'),
(2305, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 40'),
(2306, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2307, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2308, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2289'),
(2309, 11, '2025-05-13 05:48:28', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 48'),
(2310, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2311, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2312, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2313, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2314, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2315, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2316, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2317, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2318, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2319, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2320, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2321, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2322, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2323, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2324, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2325, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2326, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2306'),
(2327, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2328, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 64'),
(2329, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 65'),
(2330, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2331, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2332, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2333, 11, '2025-05-13 10:40:37', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2315'),
(2334, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2335, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2336, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2337, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2338, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2339, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2340, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2341, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2342, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2343, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2344, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2326'),
(2345, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2346, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2347, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2348, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2349, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2350, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 86'),
(2351, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2352, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2353, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2354, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2355, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2356, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2337'),
(2357, 11, '2025-05-13 11:30:52', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 98'),
(2358, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2359, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2360, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2361, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2362, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2363, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2364, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2365, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2366, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2367, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2368, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2369, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2349'),
(2370, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2371, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2372, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2373, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2374, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 108'),
(2375, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2376, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2377, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2378, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2379, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2380, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2361'),
(2381, 11, '2025-05-13 15:03:26', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 120'),
(2382, NULL, '2025-05-13 16:11:31', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10045\n	- Password:  Password inputed'),
(2383, NULL, '2025-05-13 16:11:31', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 22'),
(2384, 22, '2025-05-13 16:11:32', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 22 \n	- Full Name: Qui quis similique a\n	- Student ID: 23-10045\n	- Designation: Auditor\n	- Platform: web'),
(2385, 22, '2025-05-13 16:11:32', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 22\n	- Platform: web'),
(2386, NULL, '2025-05-13 16:11:38', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2387, NULL, '2025-05-13 16:11:38', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2388, 21, '2025-05-13 16:11:38', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: web'),
(2389, 21, '2025-05-13 16:11:38', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: web'),
(2390, NULL, '2025-05-13 16:11:41', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(2391, NULL, '2025-05-13 16:11:41', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(2392, 11, '2025-05-13 16:11:41', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(2393, 11, '2025-05-13 16:11:41', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2394, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2395, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2396, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2397, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2398, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2399, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2400, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2401, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2402, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2403, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2404, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2405, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2406, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2407, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2408, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2386'),
(2409, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2410, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 18'),
(2411, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2412, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2413, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2414, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2415, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2416, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2397'),
(2417, 11, '2025-05-13 16:11:43', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 30'),
(2418, 11, '2025-05-13 16:11:47', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2419, 11, '2025-05-13 16:11:47', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(2420, NULL, '2025-05-13 16:11:49', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(2421, NULL, '2025-05-13 16:11:49', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(2422, 11, '2025-05-13 16:11:49', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(2423, 11, '2025-05-13 16:11:49', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2424, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2425, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2426, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2427, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2428, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2429, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2430, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2431, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2432, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2433, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2434, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2435, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2436, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2437, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2438, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2439, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2440, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2441, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2442, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2420'),
(2443, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 52'),
(2444, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2445, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2446, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2428'),
(2447, 11, '2025-05-13 16:11:50', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 60'),
(2448, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2449, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2450, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2451, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2452, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2453, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2454, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2455, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2456, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2457, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2458, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2444'),
(2459, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2460, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 76'),
(2461, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2462, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2463, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2464, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2465, 11, '2025-05-13 16:12:12', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2466, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2467, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2468, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2469, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2470, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2455'),
(2471, 11, '2025-05-13 16:12:13', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 88'),
(2472, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2473, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2474, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2475, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2476, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2477, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2478, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2479, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2480, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2481, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2482, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2483, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2484, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2485, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2486, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2487, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2488, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2468'),
(2489, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(2490, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 100'),
(2491, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 101'),
(2492, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2493, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2494, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2495, 11, '2025-05-13 17:08:05', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2477'),
(2496, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2497, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2498, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2499, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2500, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2501, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2502, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2503, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2504, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2505, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2506, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2507, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2508, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2509, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2510, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2511, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2512, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2489'),
(2513, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2514, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 126'),
(2515, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2516, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2517, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2518, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2499'),
(2519, 11, '2025-05-13 19:22:44', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 132'),
(2520, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2521, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2522, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2523, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2524, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2525, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2526, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2527, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2528, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2529, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2530, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2531, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2532, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2533, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2534, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2512'),
(2535, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2536, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 144'),
(2537, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2538, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2539, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2540, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2541, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2542, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 154'),
(2543, 11, '2025-05-14 05:10:09', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2526'),
(2544, 22, '2025-05-15 07:42:49', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 22\n	- Platform: web'),
(2545, 22, '2025-05-15 07:42:49', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 22'),
(2546, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2547, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2548, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2549, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2550, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2551, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2552, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2553, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2554, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2555, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2556, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2557, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2558, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2559, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2560, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 7'),
(2561, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2562, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2539'),
(2563, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2564, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2565, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2566, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 2'),
(2567, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2568, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2549'),
(2569, 11, '2025-05-15 07:42:57', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 20'),
(2570, 11, '2025-05-15 07:43:21', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2571, 11, '2025-05-15 07:43:21', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(2572, NULL, '2025-05-15 07:43:44', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2573, NULL, '2025-05-15 07:43:44', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2574, 23, '2025-05-15 07:43:44', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: web'),
(2575, 23, '2025-05-15 07:43:44', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: web'),
(2576, NULL, '2025-05-15 08:59:38', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(2577, NULL, '2025-05-15 08:59:38', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(2578, 11, '2025-05-15 08:59:38', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: web'),
(2579, 11, '2025-05-15 08:59:38', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: web'),
(2580, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2581, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2582, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2583, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2584, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2585, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2586, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2587, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2588, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2589, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2590, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2591, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2592, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2593, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2594, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2572'),
(2595, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2596, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 43'),
(2597, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2598, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2599, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 3'),
(2600, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2601, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2602, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2583'),
(2603, 11, '2025-05-15 08:59:39', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 54'),
(2604, 23, '2025-05-15 09:36:42', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2605, 23, '2025-05-15 09:36:42', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 23'),
(2606, NULL, '2025-05-15 09:36:55', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: ADMIN-001\n	- Password:  Password inputed'),
(2607, NULL, '2025-05-15 09:36:55', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 11'),
(2608, 11, '2025-05-15 09:36:55', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 11 \n	- Full Name: Admin\n	- Student ID: ADMIN-001\n	- Designation: Admin\n	- Platform: mobile'),
(2609, 11, '2025-05-15 09:36:55', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(2610, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2611, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2612, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2613, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2614, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2615, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2616, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2617, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2618, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2619, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2620, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2621, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2622, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2623, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2624, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2625, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2626, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2627, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2628, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2629, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2607'),
(2630, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2631, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2612'),
(2632, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 83'),
(2633, 11, '2025-05-15 09:36:56', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 84'),
(2634, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2635, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2636, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2637, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2638, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2639, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2640, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2641, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2642, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2643, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2644, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2645, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2646, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2647, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2648, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2626'),
(2649, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2650, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 96'),
(2651, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2652, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2653, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2654, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2655, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2656, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2637'),
(2657, 11, '2025-05-15 09:36:59', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 109'),
(2658, 11, '2025-05-15 09:37:01', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 11\n	- Platform: mobile'),
(2659, 11, '2025-05-15 09:37:01', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 11'),
(2660, NULL, '2025-05-15 09:37:06', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2661, NULL, '2025-05-15 09:37:06', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2662, 23, '2025-05-15 09:37:06', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: mobile'),
(2663, 23, '2025-05-15 09:37:06', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2664, 23, '2025-05-15 09:59:25', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2665, 23, '2025-05-15 09:59:25', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 23'),
(2666, NULL, '2025-05-15 09:59:27', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2667, NULL, '2025-05-15 09:59:27', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2668, 23, '2025-05-15 09:59:27', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: mobile'),
(2669, 23, '2025-05-15 09:59:27', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2670, 23, '2025-05-15 09:59:32', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2671, 23, '2025-05-15 09:59:32', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 23'),
(2672, NULL, '2025-05-15 09:59:35', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10045\n	- Password:  Password inputed'),
(2673, NULL, '2025-05-15 09:59:35', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 22'),
(2674, 22, '2025-05-15 09:59:35', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 22 \n	- Full Name: Qui quis similique a\n	- Student ID: 23-10045\n	- Designation: Auditor\n	- Platform: mobile'),
(2675, 22, '2025-05-15 09:59:35', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 22\n	- Platform: mobile'),
(2676, 22, '2025-05-15 10:00:12', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 22\n	- Platform: mobile'),
(2677, 22, '2025-05-15 10:00:12', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 22'),
(2678, NULL, '2025-05-15 10:00:16', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2679, NULL, '2025-05-15 10:00:16', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2680, 21, '2025-05-15 10:00:16', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(2681, 21, '2025-05-15 10:00:16', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2682, 21, '2025-05-15 10:11:02', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2683, 21, '2025-05-15 10:11:02', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(2684, NULL, '2025-05-15 10:11:08', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10045\n	- Password:  Password inputed'),
(2685, NULL, '2025-05-15 10:11:08', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 22'),
(2686, 22, '2025-05-15 10:11:08', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 22 \n	- Full Name: Qui quis similique a\n	- Student ID: 23-10045\n	- Designation: Auditor\n	- Platform: mobile'),
(2687, 22, '2025-05-15 10:11:08', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 22\n	- Platform: mobile'),
(2688, 22, '2025-05-15 10:11:11', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 22\n	- Platform: mobile'),
(2689, 22, '2025-05-15 10:11:11', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 22'),
(2690, NULL, '2025-05-15 10:11:15', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2691, NULL, '2025-05-15 10:11:15', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2692, 23, '2025-05-15 10:11:15', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: mobile'),
(2693, 23, '2025-05-15 10:11:15', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2694, 23, '2025-05-15 10:12:19', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2695, 23, '2025-05-15 10:12:19', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 23'),
(2696, NULL, '2025-05-15 10:12:24', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2697, NULL, '2025-05-15 10:12:24', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2698, 21, '2025-05-15 10:12:24', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(2699, 21, '2025-05-15 10:12:24', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2700, 21, '2025-05-15 10:18:01', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2701, 21, '2025-05-15 10:18:01', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(2702, NULL, '2025-05-15 10:18:03', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2703, NULL, '2025-05-15 10:18:03', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2704, 21, '2025-05-15 10:18:03', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(2705, 21, '2025-05-15 10:18:03', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2706, 21, '2025-05-15 10:18:07', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2707, 21, '2025-05-15 10:18:07', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(2708, NULL, '2025-05-15 10:18:12', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2709, NULL, '2025-05-15 10:18:12', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2710, 23, '2025-05-15 10:18:12', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: mobile'),
(2711, 23, '2025-05-15 10:18:12', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2712, 23, '2025-05-15 10:18:30', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2713, 23, '2025-05-15 10:18:30', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 23'),
(2714, NULL, '2025-05-15 10:18:41', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10089\n	- Password:  Password inputed'),
(2715, NULL, '2025-05-15 10:18:41', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 21'),
(2716, 21, '2025-05-15 10:18:41', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 21 \n	- Full Name: Ad ea maiores vel mi\n	- Student ID: 23-10089\n	- Designation: Treasurer\n	- Platform: mobile'),
(2717, 21, '2025-05-15 10:18:41', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile');
INSERT INTO `log` (`id`, `user_id`, `created_at`, `tab`, `activity`, `relating_id`, `status`, `summary`, `details`) VALUES
(2718, 21, '2025-05-15 10:26:37', 'Logout', 'Logout Status Update', NULL, '2', 'Logout status updated successfully', 'User logout status updated successfully.\n\n	- User ID: 21\n	- Platform: mobile'),
(2719, 21, '2025-05-15 10:26:37', 'Logout', 'Logout Attempt', NULL, '0', 'Successfully Log Out.', 'User logout successfully.\n\n	- User ID: 21'),
(2720, NULL, '2025-05-15 10:26:40', 'Login', 'Login Attempt', NULL, '2', 'Processing Login...', 'Credentials recieved. Processing Login...\n\nEntered credentials: \n	- Student ID: 23-10048\n	- Password:  Password inputed'),
(2721, NULL, '2025-05-15 10:26:40', 'Login', 'Login Attempt', NULL, '2', 'User account detail retrive succussfully', 'User account retrive succussfully. Ready for password comparison.\n\n	- User ID: 23'),
(2722, 23, '2025-05-15 10:26:40', 'Login', 'Login Attempt', NULL, '0', 'Successful Log In.', 'Log in successful. Redirecting to dashboard.\n\n	- User ID: 23 \n	- Full Name: Ad voluptatem est co\n	- Student ID: 23-10048\n	- Designation: President\n	- Platform: mobile'),
(2723, 23, '2025-05-15 10:26:40', 'Login', 'Login Status Update', NULL, '2', 'Login status updated successfully', 'User login status updated successfully.\n\n	- User ID: 23\n	- Platform: mobile'),
(2724, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2725, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2726, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2727, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2728, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2729, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2730, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2731, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2732, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2733, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2734, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2716'),
(2735, 11, '2025-05-15 11:45:40', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 186'),
(2736, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2737, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2738, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total accounts...', 'The system is attempting to fetch the total count of accounts for Admin Dashboard.'),
(2739, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2740, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online accounts...', 'The system is attempting to fetch the count of online accounts for Admin Dashboard.'),
(2741, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2742, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2743, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2744, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total accounts', 'The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: 16'),
(2745, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2746, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online accounts', 'The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: 2'),
(2747, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online web accounts...', 'The system is attempting to fetch the count of online web accounts for Admin Dashboard.'),
(2748, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching online mobile accounts...', 'The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.'),
(2749, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2750, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2751, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2752, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching total logs...', 'The system is attempting to fetch the total count of logs for Admin Dashboard.'),
(2753, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '2', 'Fetching today\'s logs...', 'The system is attempting to fetch the count of logs created today for Admin Dashboard.'),
(2754, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online web accounts', 'The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: 3'),
(2755, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched online mobile accounts', 'The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: 1'),
(2756, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2738'),
(2757, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 16'),
(2758, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched total logs', 'The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: 2740'),
(2759, 11, '2025-05-15 18:24:00', 'Admin Dashboard', 'Fetch Dashboard Data Attempt', NULL, '0', 'Successfully fetched today\'s logs', 'The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: 18');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_at` timestamp NULL DEFAULT NULL,
  `issued_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `remit_id` int(11) DEFAULT NULL,
  `status` enum('Draft','Sent for Approval','Back to Draft','Ready to Issue','Issued') DEFAULT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `user_id`, `created_at`, `updated_at`, `approved_at`, `issued_at`, `name`, `description`, `amount`, `due_date`, `budget_id`, `remit_id`, `status`, `approval_id`, `semestral_id`) VALUES
(1, 21, '2025-05-15 17:45:54', '2025-05-15 17:45:54', '2025-05-15 09:06:25', '2025-05-15 17:45:54', 'mininininininin', 'Neque debitis invent', 12.00, '2025-05-24 08:37:00', 4, NULL, '', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('Expense','Remittance','Payment','') DEFAULT NULL,
  `relating_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `receive_from` varchar(255) DEFAULT NULL,
  `receive_to` varchar(255) DEFAULT NULL,
  `direction` varchar(50) DEFAULT NULL,
  `semestral_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipt`
--

INSERT INTO `receipt` (`id`, `user_id`, `created_at`, `updated_at`, `type`, `relating_id`, `image`, `receive_from`, `receive_to`, `direction`, `semestral_id`) VALUES
(1, 21, '2025-05-09 18:03:30', '2025-05-10 02:20:20', 'Expense', NULL, '1746813810487-457778148-Set D.png', 'Qui voluptate conseq', 'Sint qui dolor conse', 'Outgoing', NULL),
(3, 21, '2025-05-10 02:09:20', '2025-05-10 02:20:34', 'Expense', NULL, '1746842960844-168527051-Set D.png', '3456789', 'Similique ea volupta', 'Outgoing', NULL),
(4, 21, '2025-05-10 03:18:55', '2025-05-10 03:18:55', 'Expense', NULL, '1746847135712-257306687-Set D.png', 'Harum rem iusto numq', 'Nulla sed sed quis s', 'Outgoing', NULL),
(5, 21, '2025-05-10 05:25:47', '2025-05-10 05:31:02', 'Expense', 3, '1746854747083-635802651-Set D.png', 'Animi neque suscipi', 'Similique enim id n', 'Outgoing', NULL),
(6, 21, '2025-05-10 05:28:29', '2025-05-10 05:31:02', 'Expense', 3, '1746854909309-362649701-Set D.png', 'Sunt et quod ut vol', 'Nulla sit ducimus ', 'Outgoing', NULL),
(8, 21, '2025-05-10 05:40:15', '2025-05-10 05:40:32', 'Expense', 4, '1746855615680-571717864-IMG20250423143013.jpg', 'Omnis laudantium et', 'Minima aut et offici', 'Outgoing', NULL),
(9, 21, '2025-05-10 05:45:43', '2025-05-10 05:45:43', 'Expense', NULL, '1746855943598-885820143-Set D.png', 'Lorem sint voluptatu', 'Accusantium sint ape', 'Outgoing', NULL),
(10, 21, '2025-05-10 07:16:04', '2025-05-10 07:16:04', 'Expense', NULL, '1746861364526-666267434-Set D.png', 'Amet et ut et omnis', 'Neque provident off', 'Outgoing', NULL),
(11, 21, '2025-05-10 10:46:01', '2025-05-10 10:46:01', 'Expense', NULL, '1746873961446-259519131-IMG20250423143013.jpg', 'Aut inventore dolori', 'Aliquam eius volupta', 'Outgoing', NULL),
(12, 21, '2025-05-10 10:49:45', '2025-05-10 10:49:45', 'Expense', NULL, '1746874185391-283378144-Set D.png', 'Numquam sint itaque', 'Alias corporis ullam', 'Outgoing', NULL),
(16, 21, '2025-05-12 02:22:52', '2025-05-12 02:22:52', 'Expense', NULL, '1747016572476-481159197-Set D.png', '23-10048', '23-10000', 'Outgoing', NULL),
(17, 21, '2025-05-12 02:58:37', '2025-05-12 02:58:37', 'Expense', NULL, '1747018717719-605435761-Set D.png', 'Exercitationem at la', 'Soluta molestias fug', 'Outgoing', NULL),
(18, 21, '2025-05-12 03:26:59', '2025-05-12 03:26:59', 'Expense', NULL, '1747020419871-854516659-Set D.png', '23-10045', '23-10048', 'Outgoing', NULL),
(19, 21, '2025-05-12 03:29:33', '2025-05-12 03:29:33', 'Expense', NULL, '1747020573896-125373173-Set D.png', '23-10045', '23-10037', 'Outgoing', NULL),
(20, 21, '2025-05-12 03:34:24', '2025-05-12 03:34:24', 'Expense', NULL, '1747020864189-757114166-Set D.png', 'Aut qui voluptate pr', 'Deserunt dolore rem ', 'Outgoing', NULL),
(22, 21, '2025-05-12 03:54:14', '2025-05-12 03:54:32', 'Expense', NULL, '1747022072516-314982311-SLSU_Seal.png', 'Et et exercitation a', '23-10045', 'Outgoing', NULL),
(23, 21, '2025-05-12 03:57:51', '2025-05-12 03:57:51', 'Expense', NULL, '1747022271123-817783231-IMG20250423143013.jpg', 'Et dolore unde culpa', 'Adipisci qui explica', 'Outgoing', NULL),
(24, 21, '2025-05-12 03:58:03', '2025-05-12 03:58:03', 'Expense', NULL, '1747022283038-370345696-Set D.png', '23-10000', '23-10036', 'Outgoing', NULL),
(25, 21, '2025-05-12 03:58:47', '2025-05-12 03:59:43', 'Expense', NULL, '1747022383349-18167780-Seal_of_the_Department_of_Education_of_the_Philippines.png', '23-10048', '23-10039', 'Outgoing', NULL),
(26, 21, '2025-05-12 03:59:07', '2025-05-12 03:59:23', 'Expense', NULL, '1747022363209-139915837-Copy of COMSOC NEW LOGO.png', '23-10089', 'Temporibus iste ex o', 'Outgoing', NULL),
(27, 21, '2025-05-12 04:25:45', '2025-05-12 04:26:32', 'Expense', NULL, '1747023992719-567410733-IMG20250423143013.jpg', '23-10035', '23-10045', 'Outgoing', NULL),
(28, 21, '2025-05-12 13:31:57', '2025-05-12 13:31:57', 'Expense', NULL, '1747056717453-659204492-Set D.png', 'Velit rerum amet es', '23-10035', 'Outgoing', NULL),
(29, 21, '2025-05-12 13:41:32', '2025-05-12 13:41:32', 'Expense', NULL, '1747057292632-890570236-IMG20250423143013.jpg', '23-10048', 'Odio et unde earum i', 'Outgoing', NULL),
(32, 21, '2025-05-12 15:48:16', '2025-05-12 15:48:16', 'Expense', NULL, '1747064896854-639744629-Set D.png', '23-10048', 'Enim et fugiat eius ', 'Outgoing', NULL),
(34, 21, '2025-05-12 17:31:49', '2025-05-12 17:31:49', 'Expense', NULL, '1747071109433-406703349-Set D.png', '23-10045', 'Beatae officia place', 'Outgoing', NULL),
(35, 21, '2025-05-12 17:36:28', '2025-05-12 17:36:28', 'Expense', NULL, '1747071388988-420771691-Set D.png', '23-10048', 'Vel alias non rem ex', 'Outgoing', NULL),
(42, 21, '2025-05-12 19:40:18', '2025-05-12 19:40:20', 'Expense', 15, '1747078818792-918218262-IMG20250423143013.jpg', 'Dolor magni aute et ', '23-10036', 'Outgoing', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `record_group`
--

CREATE TABLE `record_group` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tab` enum('deposit','expense','','') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `record_no` varchar(50) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `record_group`
--

INSERT INTO `record_group` (`id`, `user_id`, `created_at`, `updated_at`, `tab`, `name`, `description`, `record_no`) VALUES
(1, 21, '2025-05-01 15:17:09', '2025-05-08 11:33:25', 'deposit', 'Odit minim praesenti', 'Iste assumenda tenet', '2'),
(2, 21, '2025-05-01 15:29:09', '2025-05-09 05:50:33', 'deposit', 'Aspernatur mollitia ', 'Delectus aperiam il', '3'),
(3, 21, '2025-05-01 15:29:31', '2025-05-08 06:35:47', 'deposit', 'Ut architecto et exp', 'Deleniti fugiat ame', '1'),
(4, 21, '2025-05-01 15:31:52', '2025-05-12 19:40:43', 'expense', 'Deserunt cum consect', 'Et eius omnis accusa', '5'),
(5, 21, '2025-05-01 16:12:37', '2025-05-12 04:08:00', 'deposit', 'Commodo in accusanti', 'Quidem est voluptat', '2'),
(6, 21, '2025-05-02 02:37:53', '2025-05-08 10:08:55', 'deposit', 'Qui maxime non maxim', 'Totam perferendis ut', '3'),
(7, 21, '2025-05-02 02:37:59', '2025-05-13 17:18:59', 'expense', 'Sit est labore vit', 'Aut fugiat asperiore', '3');

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
  `data_filter` varchar(255) DEFAULT NULL,
  `data_range` varchar(255) DEFAULT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `semestral_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `section_no` varchar(50) DEFAULT NULL,
  `year` varchar(4) DEFAULT NULL,
  `student_no` varchar(50) DEFAULT '0',
  `representative` int(11) DEFAULT NULL,
  `collection_balance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `user_id`, `created_at`, `updated_at`, `semestral_id`, `name`, `section_no`, `year`, `student_no`, `representative`, `collection_balance`) VALUES
(17, 11, '2025-04-23 04:31:57', '2025-05-02 00:53:35', NULL, '101', '1', '1', '3', 20, 0.00),
(18, 11, '2025-04-23 18:07:32', '2025-05-01 03:53:11', NULL, '102', '2', '1', '3', NULL, 0.00),
(19, 11, '2025-04-23 18:07:37', '2025-05-01 03:33:11', NULL, '103', '3', '1', '1', NULL, 0.00),
(20, 11, '2025-04-23 18:07:49', '2025-04-23 18:07:49', NULL, '201', '1', '2', '0', NULL, 0.00),
(21, 11, '2025-04-23 18:07:55', '2025-04-23 18:07:55', NULL, '202', '2', '2', '0', NULL, 0.00),
(22, 11, '2025-04-23 18:08:10', '2025-05-01 03:47:39', NULL, '203', '3', '2', '1', NULL, 0.00),
(23, 11, '2025-04-23 18:08:17', '2025-04-23 18:08:56', NULL, '301', '1', '3', '0', NULL, 0.00),
(24, 11, '2025-04-23 18:09:46', '2025-05-01 03:50:22', NULL, '302', '2', '3', '1', NULL, 0.00),
(25, 11, '2025-04-23 18:09:58', '2025-05-01 03:49:15', NULL, '401', '1', '4', '1', NULL, 0.00),
(26, 11, '2025-04-23 18:10:03', '2025-05-01 03:34:55', NULL, '402', '2', '4', '1', NULL, 0.00);

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

--
-- Dumping data for table `security_q`
--

INSERT INTO `security_q` (`id`, `user_id`, `q1`, `q1_answer`, `q2`, `q2_answer`, `q3`, `q3_answer`) VALUES
(6, 19, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 20, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 21, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 22, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 23, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 24, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 25, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 26, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 27, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 28, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 29, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 30, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 31, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 32, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 33, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 34, NULL, NULL, NULL, NULL, NULL, NULL);

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
  `theme` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `user_id`, `theme`) VALUES
(6, 19, 'default'),
(7, 20, 'default'),
(8, 21, 'default'),
(9, 22, 'default'),
(10, 23, 'default'),
(11, 24, 'default'),
(12, 25, 'default'),
(13, 26, 'default'),
(14, 27, 'default'),
(15, 28, 'default'),
(16, 29, 'default'),
(17, 30, 'default'),
(18, 31, 'default'),
(19, 32, 'default'),
(20, 33, 'default'),
(21, 34, 'default');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `security_q_id` int(11) DEFAULT NULL,
  `settings_id` int(11) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `is_login_web` tinyint(1) DEFAULT NULL,
  `is_login_mobile` tinyint(1) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT NULL,
  `e_signature` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `servicing_points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`id`, `full_name`, `student_id`, `email`, `initial_password`, `password`, `section_id`, `profile_pic`, `created_at`, `updated_at`, `security_q_id`, `settings_id`, `designation`, `is_login_web`, `is_login_mobile`, `is_online`, `e_signature`, `qr_code`, `servicing_points`) VALUES
(11, 'Admin', 'ADMIN-001', 'admin@example.com', NULL, '$2y$10$eyGNdVek3CernGfWxc46Ne2D1WfAarYVa5hdnoNXAs9/Tg3al0Cae', NULL, 'src/assets/profile_default.svg', '2025-03-18 15:23:49', '2025-05-15 09:37:01', NULL, NULL, 'Admin', 1, 0, 0, NULL, NULL, NULL),
(19, 'Id est autem lauda', '23-11034', 'heve@mailinator.com', 'heitv0Eu', '$2b$10$IhkrZp0YS.deKyYETFnzfeTyDO6lfltzCdpVur4j6LV1eiha6FK6K', 17, 'src/assets/profile_default.svg', '2025-04-23 04:57:05', '2025-05-08 04:08:08', 6, 6, 'Member', 1, 0, 1, NULL, NULL, 0),
(20, 'Consectetur dolo', '23-10000', 'xovavox@mailinator.com', 'q3mK4pkc', '$2b$10$nygJv3K/D0hUyc0v4utqhO15sp4NoxhnIC.0iTxdXEXB3mIXJBHbm', 17, 'src/assets/profile_default.svg', '2025-04-23 18:35:58', '2025-05-08 04:04:31', 7, 7, 'Representative', 0, 0, 0, NULL, NULL, 0),
(21, 'Ad ea maiores vel mi', '23-10089', 'wezuho@mailinator.com', 'GTsijgW6', '$2b$10$AuETepWe0YkoQfQbkkRqVOoLLeXTz.WDIO.KwB5iqD0r64pRY0CsK', 17, 'src/assets/profile_default.svg', '2025-04-29 00:04:36', '2025-05-15 10:26:37', 8, 8, 'Treasurer', 1, 0, 0, NULL, NULL, 0),
(22, 'Qui quis similique a', '23-10045', 'wixare@mailinator.com', 'AXGOZWQL', '$2b$10$THeHCiWiQAN91.s1xmq2aeVNBTYYL1B1VMx0F2exE.3MwgxNzfHFO', 23, 'src/assets/profile_default.svg', '2025-04-29 00:05:21', '2025-05-15 10:11:11', 9, 9, 'Auditor', 0, 0, 0, NULL, NULL, 0),
(23, 'Ad voluptatem est co', '23-10048', 'zymytifiju@mailinator.com', 'AwYMiSWN', '$2b$10$Db.APSw/5rSmX3hyQlpiEeBGeuWPYsUs6qdikcHppScXndSsmaWBu', 18, 'src/assets/profile_default.svg', '2025-04-29 00:07:44', '2025-05-15 10:26:40', 10, 10, 'President', 1, 1, 1, NULL, NULL, 0),
(24, 'Quas reiciendis reru', '23-10035', 'fehuvufu@mailinator.com', 'FazUE88I', '$2b$10$SLiDJB8xmkMSbPCvdhQl2ekYIJSDu9BQLPkKDUouA4PcxPSWczrc.', 17, 'src/assets/profile_default.svg', '2025-05-01 00:21:51', '2025-05-01 00:21:51', 11, 11, 'Member', 0, 0, 0, NULL, NULL, 0),
(25, 'Omnis a labore venia', '23-10036', 'sixepuraxu@mailinator.com', 'q74QcZwK', '$2b$10$vI/DNf7rpBgLRyVf6EODbeNysqQY83uXbl8cPHMQuyyk2mqWuPmLC', 17, 'src/assets/profile_default.svg', '2025-05-01 01:08:36', '2025-05-01 01:08:36', 12, 12, 'Member', 0, 0, 0, NULL, NULL, 0),
(26, 'Sit exercitation al', '23-10037', 'juda@mailinator.com', 'o0I3RaNp', '$2b$10$9aPfPFShUUWSYVBaGWXHhe8OAaFdiqvXJ.VcC6MzAXc6NtP4RP5xe', 18, 'src/assets/profile_default.svg', '2025-05-01 03:31:14', '2025-05-01 03:31:14', 13, 13, 'Member', 0, 0, 0, NULL, NULL, 0),
(27, 'Alias nihil ad sit q', '23-10038', 'luviwyn@mailinator.com', '1jNIHwkv', '$2b$10$2gU9QAB6pH/KZMcbjJAVveOm9Otk5RXngI0S5sUbHSRg15MigiyUW', 18, 'src/assets/profile_default.svg', '2025-05-01 03:32:04', '2025-05-01 03:32:04', 14, 14, 'Member', 0, 0, 0, NULL, NULL, 0),
(28, 'Ab est velit iste ir', '23-10039', 'qojyqy@mailinator.com', 'k6E8WmTW', '$2b$10$MQriHGPt47U80n6NEEqyoeCTYGgSfwZbLazxlfuPm7AvMIYeX2Udq', 19, 'src/assets/profile_default.svg', '2025-05-01 03:33:11', '2025-05-01 03:33:11', 15, 15, 'Member', 0, 0, 0, NULL, NULL, 0),
(29, 'Pariatur Quia dolor', '23-10040', 'syqule@mailinator.com', 'o1Q97xui', '$2b$10$sNXIvCCZHzhKFm4YfG6XAO5CrmFBIq7u5TtwzbuzukLWyuHzrP4ce', 26, 'src/assets/profile_default.svg', '2025-05-01 03:34:55', '2025-05-01 03:34:55', 16, 16, 'Member', 0, 0, 0, NULL, NULL, 0),
(30, 'Optio velit culpa a', '23-10041', 'munafukumi@mailinator.com', 'ePofy4bR', '$2b$10$iFZXJ/d2bIgHokZvsIunMuDL1u6.FlZ80OFUAUSELaGxCxpxbhNkO', 22, 'src/assets/profile_default.svg', '2025-05-01 03:47:39', '2025-05-01 03:47:39', 17, 17, 'Member', 0, 0, 0, NULL, NULL, 0),
(31, 'Consequat Quia opti', '23-10042', 'gufezyvo@mailinator.com', 'ZlKGkHnG', '$2b$10$6xR.X.xiCAqGul8u8Br5HeSQ5uyhWmnFhOSZzda8IIp56n1x/HDAa', 25, 'src/assets/profile_default.svg', '2025-05-01 03:49:15', '2025-05-01 03:49:15', 18, 18, 'Member', 0, 0, 0, NULL, NULL, 0),
(32, 'Velit dolores invent', '23-10043', 'liqakydi@mailinator.com', 'wAHcIqNu', '$2b$10$rn9vd8geMUbschE.o9QCTOwFms4F0VdvxXRkYUVY1Ml5u4qdP1RzO', 24, 'src/assets/profile_default.svg', '2025-05-01 03:50:22', '2025-05-01 03:50:22', 19, 19, 'Member', 0, 0, 0, NULL, NULL, 0),
(33, 'Molestiae nostrum mi', '23-10044', 'disake@mailinator.com', 'ggwWiq1b', '$2b$10$Pi1a6vuj9ZAQa0SMbE5pOe7ryo7G75jlE9AKU5ScBfPIKCgYdqmDe', 18, 'src/assets/profile_default.svg', '2025-05-01 03:53:11', '2025-05-01 03:53:11', 20, 20, 'Member', 0, 0, 0, NULL, NULL, 0),
(34, 'Hic adipisicing qui ', '23-10046', 'semomab@mailinator.com', 'OZDP7vmF', '$2b$10$Kr9BsMxFqUzuGeTuuWqfCOnOKkL3CKpwI14yT1/sGfehk7mwfwy02', 17, 'src/assets/profile_default.svg', '2025-05-02 00:53:35', '2025-05-02 00:53:36', 21, 21, 'Member', 0, 0, 0, NULL, NULL, 0);

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
  ADD KEY `fk_attendance_attendee` (`attendee_student_id`),
  ADD KEY `fk_attendance_user` (`attendance_user_id`),
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
  ADD KEY `fk_collection_receipt` (`receipt_id`),
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
  ADD KEY `fk_deposit_record_group` (`record_group_id`),
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
  ADD KEY `fk_expense_record_group` (`record_group_id`),
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
  ADD KEY `fk_record_group_user` (`user_id`);

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
  ADD KEY `fk_security_q_user` (`user_id`);

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
  ADD KEY `fk_user_account_section` (`section_id`),
  ADD KEY `fk_user_account_security_q` (`security_q_id`),
  ADD KEY `fk_user_account_settings` (`settings_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2760;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `record_group`
--
ALTER TABLE `record_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `security_q`
--
ALTER TABLE `security_q`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `semestral`
--
ALTER TABLE `semestral`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_announcement_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_announcement_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_announcement_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `approval`
--
ALTER TABLE `approval`
  ADD CONSTRAINT `fk_approval_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_attendee` FOREIGN KEY (`attendee_student_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_attendance_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_attendance_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_attendance_user` FOREIGN KEY (`attendance_user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit`
--
ALTER TABLE `audit`
  ADD CONSTRAINT `fk_audit_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `fk_budget_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budget_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budget_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collection`
--
ALTER TABLE `collection`
  ADD CONSTRAINT `fk_collection_collector` FOREIGN KEY (`collector_user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collection_payer` FOREIGN KEY (`payer_student_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collection_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collection_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collection_remit` FOREIGN KEY (`remit_id`) REFERENCES `remit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collection_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `fk_dashboard_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dashboard_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `deposit`
--
ALTER TABLE `deposit`
  ADD CONSTRAINT `fk_deposit_record_group` FOREIGN KEY (`record_group_id`) REFERENCES `record_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deposit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_document_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_event_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `fk_expense_budget` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_expense_record_group` FOREIGN KEY (`record_group_id`) REFERENCES `record_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_expense_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_expense_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `log`
--
ALTER TABLE `log`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `fk_meetings_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meetings_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meetings_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meetings_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `fk_notification_receiver` FOREIGN KEY (`receiver`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_budget` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_remit` FOREIGN KEY (`remit_id`) REFERENCES `remit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `fk_receipt_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_receipt_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `record_group`
--
ALTER TABLE `record_group`
  ADD CONSTRAINT `fk_record_group_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `remit`
--
ALTER TABLE `remit`
  ADD CONSTRAINT `fk_remit_deposit` FOREIGN KEY (`deposit_id`) REFERENCES `deposit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_remit_section` FOREIGN KEY (`section`) REFERENCES `section` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_remit_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_remit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_approval` FOREIGN KEY (`approval_id`) REFERENCES `approval` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_audit` FOREIGN KEY (`audit_id`) REFERENCES `audit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_document` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_section_representative` FOREIGN KEY (`representative`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_section_semestral` FOREIGN KEY (`semestral_id`) REFERENCES `semestral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_section_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `security_q`
--
ALTER TABLE `security_q`
  ADD CONSTRAINT `fk_security_q_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `semestral`
--
ALTER TABLE `semestral`
  ADD CONSTRAINT `fk_semestral_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `fk_user_account_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_account_security_q` FOREIGN KEY (`security_q_id`) REFERENCES `security_q` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_account_settings` FOREIGN KEY (`settings_id`) REFERENCES `settings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
