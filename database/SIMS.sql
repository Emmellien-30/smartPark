-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2026 at 05:20 PM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `SIMS`
--

-- --------------------------------------------------------

--
-- Table structure for table `spare_part`
--

CREATE TABLE `spare_part` (
  `part_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `spare_part`
--

INSERT INTO `spare_part` (`part_id`, `name`, `category`, `quantity`, `unit_price`, `total_price`) VALUES
(7, 'Water Pumb', 'Cooling System', 2, 10000.00, 20000.00),
(8, 'Spark Plugs', 'Engine Components', 1, 1000.00, 2000.00),
(9, 'Valves & Camshafts', 'Engine Components', 0, 33333.00, 99999.00),
(10, 'Car Pomb', 'Shield', 2, 400.00, 2000.00),
(11, 'Screen', 'Machine', 0, 30000.00, 90000.00),
(12, 'Power Supply', 'Battery', 7, 2000.00, 4000.00);

-- --------------------------------------------------------

--
-- Table structure for table `stock_in`
--

CREATE TABLE `stock_in` (
  `sin_id` int NOT NULL,
  `part_id` int DEFAULT NULL,
  `stockin_quantity` int DEFAULT NULL,
  `stockin_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stock_in`
--

INSERT INTO `stock_in` (`sin_id`, `part_id`, `stockin_quantity`, `stockin_date`) VALUES
(4, 7, 3, '2026-03-03'),
(5, 7, 1, '2026-03-03'),
(6, 7, 1, '2026-03-03'),
(7, 8, 1, '2026-03-03'),
(8, 10, 1, '2026-03-03'),
(9, 10, 1, '2026-03-03'),
(10, 10, 1, '2026-03-03'),
(11, 11, 1, '2026-03-03'),
(12, 12, 1, '2026-03-05'),
(13, 12, 1, '2026-03-05'),
(14, 12, 3, '2026-03-05');

-- --------------------------------------------------------

--
-- Table structure for table `stock_out`
--

CREATE TABLE `stock_out` (
  `sout_id` int NOT NULL,
  `part_id` int DEFAULT NULL,
  `sout_quantity` int DEFAULT NULL,
  `sout_unitprice` decimal(10,2) DEFAULT NULL,
  `sout_totalprice` decimal(10,2) DEFAULT NULL,
  `stockout_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stock_out`
--

INSERT INTO `stock_out` (`sout_id`, `part_id`, `sout_quantity`, `sout_unitprice`, `sout_totalprice`, `stockout_date`) VALUES
(9, 7, 1, 16000.00, 16000.00, '2026-03-03'),
(10, 7, 2, 55555.00, 111110.00, '2026-03-04'),
(12, 8, 2, 33333.00, 66666.00, '2026-03-04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'amani@gmail.com', '$2b$10$9x3nimQdD9ENiU/pQi7f/ehUNZV/gHOb2WzD7iuJPg3qC2sg4HK1a'),
(15, 'guillaume@gmail.com', '$2b$10$irOvQoJC3Y.JKzRJDSjHw.mXrC4UVKMFgn9DHES9uogRP67pQyKhO'),
(16, 'Germaine', '$2b$10$54YpBCQtinABYzp7YUj84uwkKgbUjHgvuHYCOvpHKunIWzMLdtVCm'),
(18, 'Jam', '$2b$10$d9RkUqIxfRioTWooVCrmC.LRXuJdCwAxI/GCA0v7RHnEWENdV7DTy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `spare_part`
--
ALTER TABLE `spare_part`
  ADD PRIMARY KEY (`part_id`);

--
-- Indexes for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD PRIMARY KEY (`sin_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Indexes for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD PRIMARY KEY (`sout_id`),
  ADD KEY `part_id` (`part_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `spare_part`
--
ALTER TABLE `spare_part`
  MODIFY `part_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `stock_in`
--
ALTER TABLE `stock_in`
  MODIFY `sin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `stock_out`
--
ALTER TABLE `stock_out`
  MODIFY `sout_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD CONSTRAINT `stock_in_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `spare_part` (`part_id`);

--
-- Constraints for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD CONSTRAINT `stock_out_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `spare_part` (`part_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
