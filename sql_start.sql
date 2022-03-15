CREATE DATABASE  IF NOT EXISTS `spit` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spit`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: spit
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `addressid` int NOT NULL AUTO_INCREMENT,
  `fk_userid` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `postal_code` varchar(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`addressid`),
  UNIQUE KEY `fk_address_per_user` (`fk_userid`,`address`,`postal_code`,`name`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (37,4,'#05-80 Orchard Road','kenneth','351826','2022-01-28 13:18:14'),(38,15,'Jurong East','Sam','123123','2022-02-05 13:40:55');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Laptops','Portability? Battery life? Sheer power? Look no further, our laptops excel in all categories'),(3,'Mice','Accuracy and battery life are our priorities. We offer you a range of high quality products.'),(6,'Audio','Lofi, classical, rap, you name it -- we\'ll play it.'),(7,'Keyboards','A selection of keyboards, from gaming to productivity!'),(8,'Smartphones','Work, play, relax. Our smartphones are capable of doing them all!'),(9,'Smartwatch','Packing power into a compact form, our smartwatches will meet your high expectations'),(10,'Game consoles','Consoles, controllers, you name it and we\'ll have it!'),(12,'Clocks','clocks'),(15,'Wigs','hihi');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `discountid` int NOT NULL AUTO_INCREMENT,
  `product_discount` int NOT NULL,
  `fk_productid` int NOT NULL,
  `fk_promotionid` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`discountid`),
  UNIQUE KEY `fk_productid` (`fk_productid`,`fk_promotionid`),
  KEY `fk_promotion` (`fk_promotionid`),
  CONSTRAINT `discount_ibfk_1` FOREIGN KEY (`fk_productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE,
  CONSTRAINT `discount_ibfk_2` FOREIGN KEY (`fk_promotionid`) REFERENCES `promotion` (`promotionid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
INSERT INTO `discount` VALUES (1,15,1,2,'2021-12-30 05:23:33'),(2,15,1,3,'2021-12-30 05:23:33'),(3,10,1,4,'2021-12-30 05:23:33'),(4,10,2,2,'2021-12-30 05:23:33'),(5,15,2,3,'2021-12-30 05:23:33'),(6,10,5,4,'2021-12-30 05:23:33'),(7,20,5,2,'2021-12-30 05:23:33'),(8,20,6,3,'2021-12-30 05:23:33'),(9,20,7,4,'2021-12-30 05:23:33'),(10,10,7,1,'2021-12-30 05:23:33'),(11,10,7,2,'2021-12-30 05:23:33'),(12,10,7,3,'2021-12-30 05:23:33'),(13,5,10,1,'2021-12-30 05:23:33'),(14,5,10,2,'2021-12-30 05:23:33'),(15,5,10,3,'2021-12-30 05:23:33'),(17,10,13,1,'2021-12-30 05:23:33'),(18,15,13,2,'2021-12-30 05:23:33'),(19,15,13,3,'2021-12-30 05:23:33'),(20,15,14,4,'2021-12-30 05:23:33'),(21,15,15,1,'2021-12-30 05:23:33'),(22,15,16,2,'2021-12-30 05:23:33'),(23,15,17,3,'2021-12-30 05:23:33'),(24,15,18,4,'2021-12-30 05:23:33'),(25,20,20,1,'2021-12-30 05:23:33'),(26,20,20,2,'2021-12-30 05:23:33'),(27,20,20,3,'2021-12-30 05:23:33'),(28,20,20,4,'2021-12-30 05:23:33'),(29,20,21,1,'2021-12-30 05:23:33'),(30,10,21,2,'2021-12-30 05:23:33'),(31,10,21,3,'2021-12-30 05:23:33'),(32,10,21,4,'2021-12-30 05:23:33'),(33,5,22,1,'2021-12-30 05:23:33'),(34,5,22,2,'2021-12-30 05:23:33'),(35,5,22,3,'2021-12-30 05:23:33'),(36,5,22,4,'2021-12-30 05:23:33'),(39,10,24,3,'2021-12-30 05:23:33'),(40,10,25,4,'2021-12-30 05:23:33'),(46,15,23,3,'2022-01-28 15:08:57'),(47,50,23,1,'2022-01-28 15:13:33');
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderid` int NOT NULL AUTO_INCREMENT,
  `fk_userid` int NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `cvv` varchar(3) NOT NULL,
  `card_name` varchar(255) NOT NULL,
  `card_expiration` timestamp NOT NULL,
  `address` varchar(255) NOT NULL,
  `address_name` varchar(255) NOT NULL,
  `address_postal` varchar(6) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderid`),
  KEY `cascade_userid` (`fk_userid`),
  CONSTRAINT `cascade_userid` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (37,4,'4916624324227638','125','kea','2025-02-28 16:00:00','#05-69 Orchard Road','kenneth','351826',1200.00,'2022-01-29 12:55:03'),(38,4,'4916624324227638','125','kea','2025-02-28 16:00:00','#05-69 Orchard Road','kenneth','351826',4491.00,'2022-01-29 12:56:33'),(39,15,'4916289039392000','123','Sammy Dead','2023-02-28 16:00:00','Jurong East','Sam','123123',1335.00,'2022-02-05 13:42:00'),(40,15,'4916289039392000','123','Sammy Dead','2023-02-28 16:00:00','Jurong East','Sam','123123',315.00,'2022-02-06 03:29:34'),(41,15,'4916289039392000','123','Sammy Dead','2023-02-28 16:00:00','Jurong East','Sam','123123',1480.00,'2022-02-06 08:16:28'),(42,15,'4916289039392000','123','Sammy Dead','2023-02-28 16:00:00','Jurong East','Sam','123123',150.00,'2022-02-11 04:27:35'),(43,15,'4307380146347123','123','fasd','2025-02-28 16:00:00','singapore','lee kuan yew yhasdhfashdf','123123',415.00,'2022-02-11 05:26:42');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `paymentid` int NOT NULL AUTO_INCREMENT,
  `fk_userid` int NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `cvv` int NOT NULL,
  `card_name` varchar(255) NOT NULL,
  `card_expiration` timestamp NOT NULL,
  PRIMARY KEY (`paymentid`),
  UNIQUE KEY `fk_unique_card_user` (`fk_userid`,`card_number`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (36,4,'4916624324227638',125,'kea','2025-02-28 16:00:00'),(37,15,'4916289039392000',123,'Sammy Dead','2023-02-28 16:00:00'),(38,15,'4307380146347123',123,'fasd','2025-02-28 16:00:00');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `categoryid` int NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imageURL` varchar(10000) NOT NULL DEFAULT 'img\\defaultProduct.png.png',
  PRIMARY KEY (`productid`),
  UNIQUE KEY `name` (`name`),
  KEY `categoryid` (`categoryid`),
  FULLTEXT KEY `name_2` (`name`,`description`,`brand`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'AZER SMARTWATCH','Azer\'s smartwatch is better than ever. Striking a CPU clock speed of 40Mhz at the light weight of 0.2kg, the watch can outperform even smartphones.',9,'AZER',200.00,'2021-12-24 13:54:54','img\\defaultProduct.png'),(2,'AZUZ SMARTBAND','AZUZ\'s smartband does it all. With all new innovative features: distance tracking, in built GPS system, camera and more, this is quite literally the bang on your buck.',9,'AZUZ',250.00,'2021-12-17 03:26:47','img\\defaultProduct.png'),(3,'ORANGE MECWATCH','Stay connected to family and friends with calls, texts, and email, even when you don’t have your phone\r\nStream music, podcasts, and audiobooks on the go, and leave your phone at home',9,'ORANGE',225.00,'2021-12-23 18:05:40','img\\defaultProduct.png'),(4,'SHARD W240','SIZE & STYLE: Ergonomic ultralight weight gaming mouse ideal for [SMALL to MEDIUM] hands. Built for speed, control, and comfort.\r\nULTRA FLEXIBLE CABLE: Our Braided \'Ascended\' Cord is so light it produces a drag-free wireless feel.',3,'SHARD',300.00,'2021-12-23 02:44:28','img\\defaultProduct.png'),(5,'ORANGE IPHONE PRO','It\'s in the name, every product we make is as great as an orange. The IPHONE PRO series has a tested 48 hour battery life, all thanks to the new SNAPDRAGON CPU 48X. MEMORY: 256GB. COLOR: RED.',8,'ORANGE',50.00,'2021-12-28 02:01:47','img\\defaultProduct.png'),(6,'GLURIOUS PODS','Pods made in heaven. Lighter than a feather, but the sound quality on par with the best of the best headphones. With new features such as auto ear protection and water resistance, these pods will never fail you.',6,'GLURIOUS',65.00,'2021-12-26 20:31:56','img\\defaultProduct.png'),(7,'LOJITECH CONTROLLER','You\'ve seen it dominate in pro matches. Now it\'s your turn. With a polling rate of 2000hz and up to 18000DPI, we want to see you win!',10,'LOJITECH',45.00,'2021-12-19 19:10:50','img\\defaultProduct.png'),(8,'RAYZER TARANTULA TKL CHERRY RED','Rayzer\'s tarantula series is the best keyboard on the market. Specifically designed for gamers by gamers, we can confidently say there is no keyboard like the Tarantula. Size: TKL(Tenkeyless), Switch: Cherry Red, Keycaps: PBT Dyesubbed Rayzer Keycaps',7,'RAYZER',150.00,'2021-12-30 04:54:48','img\\defaultProduct.png'),(9,'RAYZER TARANTULA TKL CHERRY BLUE','Rayzer\'s tarantula series is the best keyboard on the market. Specifically designed for gamers by gamers, we can confidently say there is no keyboard like the Tarantula. Size: TKL(Tenkeyless), Switch: Cherry Blue, Keycaps: PBT Dyesubbed Rayzer Keycaps',7,'RAYZER',150.00,'2021-12-19 09:37:58','img\\defaultProduct.png'),(10,'RAYZER TARANTULA 60 GATERON YELLOW','Rayzer\'s tarantula series is the best keyboard on the market. Specifically designed for gamers by gamers, we can confidently say there is no keyboard like the Tarantula. Size: 60(60 percent), Switch: Gateron Yellow, Keycaps: PBT Dyesubbed Rayzer Keycaps',7,'RAYZER',140.00,'2021-12-18 04:01:54','img\\defaultProduct.png'),(11,'AZER SMARTWATCH V2','The next generation smartwatch. Now with new features: keep track of notes, events, calendar, inbuilt camera and more! This smartwatch is made of carbon fiber, with a durability score of 9/10.',9,'BEFORESHOCK',150.00,'2021-12-16 09:52:01','img\\defaultProduct.png'),(12,'SONY WARGRIP','SONY\'s Wargrip excels in comfort and durability. With a response time of 5ms, this controller provides you with that extra cutting-edge advantage to help you beat your opponents! ',10,'SONY',2200.00,'2021-12-25 07:50:53','img\\defaultProduct.png'),(13,'ORANGE IPHONE PRO 2','The successor to the perfect IPHONE PRO 1, Orange builds upon that perfection, providing you with IPHONE PRO 2. With a brand new bright screen with a staggering refresh rate of 120hz and blue light protection, our premium smartphone is something you know you want.',8,'ORANGE',1200.00,'2021-12-19 04:14:50','img\\defaultProduct.png'),(14,'AZUZ SMARTBAND V2','The successor of AZUZ\'s famous SMARTBAND. Now with more innovative features such as blood pressure monitoring and drop detection, we can safely say that this watch is simply the best on the market.',9,'AZUZ',300.00,'2021-12-17 16:17:56','img\\defaultProduct.png'),(15,'AZUZ ROG PHONE','Asus ROG Phone 5 ZS673KS / I005DA 5G Dual 256GB 16GB RAM Factory Unlocked (GSM Only | No CDMA - not Compatible with Verizon/Sprint) Tencent Games Google Play Installed - Phantom Black The Qualcomm Snapdragon 888 5G Mobile Platform Takes Mobile Processing Power to a New Level. With a Stunning 35% Increase in Rendering Performance, Even the Most Demanding 3D Games run Smoothly with Maxed-out Settings. ',8,'AZUZ',2200.00,'2021-12-28 15:21:40','img\\defaultProduct.png'),(16,'ORANGE MECBOOK PAD','Gorgeous 10.2-inch Retina display with True Tone\r\nA13 Bionic chip with Neural Engine\r\n8MP Wide back camera, 12MP Ultra Wide front camera with Center Stage',8,'ORANGE',1000.00,'2021-12-17 22:31:01','img\\defaultProduct.png'),(17,'KORSAIR SMITE60 GATERON YELLOW','KORSAIR\'s smite series will win them all. Speed, ergonomics, build quality. It\'s never been done before. Size: 60(60 percent), Switch: Gateron Yellow',7,'KORSAIR',140.00,'2021-12-29 13:06:29','img\\defaultProduct.png'),(18,'BOSE N2','BOSE\'s N series boasts their patented active noise cancelling technology. Blocking out up to 12dB of sound, the N2 provides you with everyday comfort.',6,'BOSE',100.00,'2021-12-21 16:35:50','img\\defaultProduct.png'),(19,'ORANGE PODS','The classic orange pods. With audio ranges from 0 to 20khz, these pods pack power and premium quality into a small compact form.',6,'ORANGE',150.00,'2021-12-17 14:16:10','img\\defaultProduct.png'),(20,'ORANGE IPHONE SE','The classic and original iPhone SE. Dimensions: 198mm * 108mm. Weight: 0.3kg.',8,'ORANGE',120.00,'2021-12-20 16:09:46','img\\defaultProduct.png'),(21,'MECBOOK PRO','The MECBOOK PRO series is targeted towards working individuals. Our light weight yet high performance CPU not only makes it easy to carry around but transforms into a workstation when plugged in.',1,'ORANGE',30.00,'2021-12-20 08:36:50','img\\defaultProduct.png'),(22,'SENDISK ULTRA 3.0','The most elegant smart watch you can find. Sony has invented the all powerful yet all beautiful smart watch. EDA Scan app detects electrodermal activity which may indicate your body\'s response to stress and a built-in skin temperature sensor logs yours each night so you can see when it varies',9,'SENDISK',30.00,'2021-12-23 13:11:18','img\\defaultProduct.png'),(23,'ASTRA A40','Premium headphones that we can guarantee will last you a decade. Driver: 50mm, Frequency Response: 20Hz-20KHz, Impedance: 39(passive), 5000(active), Sensitivity: 107db+/-3db',6,'ASTRA',235.00,'2021-12-26 10:42:29','img\\defaultProduct.png'),(24,'LOJITECH B245','Next-generation Headphone with 2.0 surround sound. Powered by Lojitech software. Driver: 50mm, Frequency Response: 20Hz-18KHz, Impedance: 30(passive), 5500(active), Sensitivity: 107db+/-3db',6,'LOJITECH',175.00,'2021-12-17 08:34:59','img\\defaultProduct.png'),(25,'TURTLENECK A5','Studio headset designed for quality production. Driver: 60mm, Frequency Response: 10Hz-22KHz, Impedance: 30(passive), 5500(active), Sensitivity: 107db+/-3db',6,'TURTLENECK',205.00,'2021-12-19 05:23:55','img\\defaultProduct.png'),(26,'LENOVOH PRO 5','The new Lenovoh product allows you to switch between high battery life and powerful performance.',1,'LENOVOH',2235.00,'2021-12-27 19:51:05','img\\defaultProduct.png'),(27,'AZER NETRO 2','Who says you can\'t game on a budget? We\'re here to prove them wrong. Both stunning in design and friendly for your wallet, this laptop is a must have',1,'AZER',1200.00,'2021-12-23 05:40:08','img\\defaultProduct.png'),(28,'MECBOOK M2 CHIP 16INCH','Fret no more, our MECBOOK has been built with the new M2 Chip, both battery-friendly and highly performing at the same time. Our sleek yet light-weight design is something to die for.',1,'ORANGE',1995.00,'2021-12-16 11:23:54','img\\defaultProduct.png'),(29,'MECBOOK LIGHT','Orange\'s MECBOOK LIGHT series goes beyond the PRO, providing you the lightest of ultrabooks while still being able to maintain a strong CPU performance. All thanks to Orange\'s new M1 chip, this laptop is able to provide you all: energy efficiency, light weight and high caliber performance.',1,'ORANGE',1850.00,'2021-12-24 10:35:30','img\\defaultProduct.png'),(31,'YES','nice wig',15,'ORANGE',123.00,'2022-02-11 05:23:17','img\\defaultProduct.png');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promotionid` int NOT NULL AUTO_INCREMENT,
  `promotionname` varchar(255) NOT NULL,
  `start` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotionid`),
  UNIQUE KEY `promotionname` (`promotionname`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'New Year 2021','2021-12-19 16:00:00','2022-03-30 16:00:00','2021-12-28 05:28:13'),(2,'Spring Sale 2022','2022-06-09 16:00:00','2022-07-09 16:00:00','2021-12-25 03:23:25'),(3,'Halloween Sale 2022','2022-10-24 16:00:00','2022-11-04 16:00:00','2021-12-24 19:08:55'),(4,'Back To School Sale 2022','2021-04-14 16:00:00','2022-04-24 16:00:00','2022-12-18 08:10:46');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `purchaseid` int NOT NULL AUTO_INCREMENT,
  `fk_orderid` int NOT NULL,
  `fk_productid` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`purchaseid`),
  UNIQUE KEY `fk_order_product` (`fk_orderid`,`fk_productid`),
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`fk_orderid`) REFERENCES `orders` (`orderid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES (36,36,1,2),(37,36,3,1),(38,36,19,1),(39,36,2,1),(40,36,14,1),(41,36,21,1),(42,36,27,1),(43,37,27,1),(44,38,1,2),(45,38,2,1),(46,38,7,1),(47,38,28,1),(48,38,29,1),(49,39,11,1),(50,39,27,1),(51,40,1,1),(52,40,11,1),(53,41,17,2),(54,41,27,1),(55,42,11,1),(56,43,1,1),(57,43,23,1);
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `fk_productid` int NOT NULL,
  `fk_userid` int NOT NULL,
  `rating` int NOT NULL,
  `review` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  UNIQUE KEY `fk_userid` (`fk_userid`,`fk_productid`),
  KEY `review_ibfk_2` (`fk_productid`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`fk_productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,2,4,'I have been buying monitors for over 10 years now and I can say that this monitor is the best one I have ever used. It \nis very fast, with no delay in the screen or between inputs. The price point is unbeatable, especially if you are looking for a budget friendly option. Highly recommend!','2021-12-28 13:22:17'),(2,1,3,4,'It does not seem possible that this monitor can be so quick and responsive for the price. I\'ve had mine for a little over a week now and it\'s been great. The picture is bright, the colors are rich, and it gets plenty bright for my eyes. I\'m blown away by how fast this is too! It has to be the fastest monitor I have ever tried.','2021-12-25 05:41:23'),(3,1,4,5,'I was skeptical about the monitor because I never heard of it before. It was about $100 cheaper than other monitors I researched, but luckily it has proven to be the best monitor out there. Installation took all of 20 minutes and now I can finally see my screen in all its clarity.','2021-12-24 06:56:32'),(4,1,6,3,'I really like this monitor for what it is, but the design could be better. Sure, it\'s got some neat features like its built-in speakers and USB ports, but I feel like they\'re not fully taking advantage of their own device. They did include a stand with the monitor but it\'s not adjustable or anything, which is really disappointing.','2021-12-29 12:15:00'),(5,2,1,5,'I saw one of these in Macau and I bought one.','2021-12-16 11:01:48'),(6,2,5,4,'The box this comes in is 4 meter by 5 foot and weights 18 kilogram.','2021-12-19 13:00:29'),(7,2,6,5,'one of my hobbies is cooking. and when i\'m cooking this works great.','2021-12-18 02:33:27'),(8,2,7,3,'The box this comes in is 3 meter by 5 foot and weights 11 kilogram.','2021-12-29 16:22:15'),(9,2,4,3,'heard about this on alternative dance radio, decided to give it a try.','2021-12-21 20:47:22'),(10,3,2,2,'one of my hobbies is spearfishing. and when i\'m spearfishing this works great.','2021-12-18 01:26:35'),(11,3,8,4,'I tried to maul it but got onion all over it.','2021-12-22 11:27:14'),(12,3,10,4,'i use it profusely when i\'m in my garage.','2021-12-27 23:32:55'),(13,3,9,5,'My macaroni penguin loves to play with it.','2021-12-28 05:59:17'),(14,4,1,5,'My bass loves to play with it.','2021-12-27 01:54:09'),(15,4,2,5,'My macaroni penguin loves to play with it.','2021-12-20 10:09:22'),(16,4,5,4,'The box this comes in is 4 meter by 5 foot and weights 18 kilogram.','2021-12-18 15:40:52'),(17,4,3,5,'i use it on Mondays when i\'m in my fort.','2021-12-29 18:32:40'),(18,4,4,1,'The box this comes in is 5 kilometer by 6 yard and weights 18 gram.','2021-12-20 16:17:10'),(19,4,6,2,'one of my hobbies is piano. and when i\'m playing piano this works great.','2021-12-25 20:24:19'),(20,4,8,2,'My terrier loves to play with it.','2021-12-22 23:46:32'),(22,5,4,1,'I tried to cremate it but got Turkish Delight all over it.','2021-12-20 16:37:42'),(23,5,7,1,'talk about contempt!!!','2021-12-23 16:56:29'),(24,5,2,4,'My co-worker Tyron has one of these. He says it looks stout.','2021-12-26 05:25:46'),(25,5,3,3,'My neighbor Lonnie has one of these. She works as a hobbit and she says it looks microscopic.','2021-12-29 18:55:50'),(26,5,9,1,'My co-worker Erick has one of these. He says it looks fluffy.','2021-12-26 00:58:20'),(27,5,8,4,'i use it once a week when i\'m in my firetruck.','2021-12-24 14:40:36'),(28,6,2,3,'This product works considerably well. It recklessly improves my basketball by a lot.','2021-12-28 17:04:30'),(29,6,4,2,'My co-worker Atha has one of these. He says it looks narrow.','2021-12-25 11:57:09'),(30,6,10,5,'heard about this on alternative dance radio, decided to give it a try.','2021-12-25 03:08:40'),(31,6,7,4,'My neighbor Karly has one of these. She works as a gambler and she says it looks tall.','2021-12-18 22:28:24'),(32,6,8,3,'heard about this on alternative dance radio, decided to give it a try.','2021-12-17 01:32:24'),(34,7,3,2,'This product works quite well. It pointedly improves my golf by a lot.','2021-12-22 00:25:44'),(35,7,2,2,'The box this comes in is 3 light-year by 5 meter and weights 10 ounce!','2021-12-29 00:05:15'),(36,7,10,2,'I saw one of these in Libya and I bought one.','2021-12-20 17:45:28'),(37,7,4,1,'It only works when I\'m Chad.','2021-12-28 11:08:06'),(39,7,6,1,'The box this comes in is 5 kilometer by 5 inch and weights 13 kilogram!!!','2021-12-21 18:14:39'),(40,8,5,2,'My neighbor Frona has one of these. She works as a gambler and she says it looks bearded.','2021-12-26 22:48:16'),(41,8,8,3,'this product is ratty.','2021-12-25 05:53:48'),(42,8,2,2,'I tried to electrocute it but got sweetmeat all over it.','2021-12-29 03:40:40'),(44,8,9,1,'one of my hobbies is mushroom cultivation. and when i\'m cultivating mushrooms this works great.','2021-12-25 08:06:19'),(45,8,6,4,'this product is light-hearted.','2021-12-19 01:12:57'),(46,9,9,4,'The box this comes in is 3 kilometer by 5 inch and weights 13 ton.','2021-12-17 00:22:13'),(47,9,10,5,'It only works when I\'m Martinique.','2021-12-25 16:48:45'),(49,9,6,1,'one of my hobbies is gaming. and when i\'m gaming this works great.','2021-12-16 19:57:46'),(50,9,7,1,'I tried to slay it but got truffle all over it.','2021-12-24 05:44:46'),(52,10,4,3,'I saw one of these in Grenada and I bought one.','2021-12-29 10:37:02'),(53,10,5,2,'I tried to annihilate it but got bonbon all over it.','2021-12-23 13:20:41'),(56,10,2,1,'I tried to annihilate it but got bonbon all over it.','2021-12-22 08:01:59'),(57,10,6,3,'It only works when I\'m Bahrain.','2021-12-17 16:51:15'),(58,11,5,2,'talk about hatred!!!','2021-12-19 06:46:43'),(59,11,6,2,'The box this comes in is 3 meter by 6 yard and weights 12 pound.','2021-12-27 01:56:19'),(60,11,4,3,'My hummingbird loves to play with it.','2021-12-19 07:57:52'),(61,11,9,2,'heard about this on Kansas City jazz radio, decided to give it a try.','2021-12-27 04:36:52'),(62,11,2,5,'This product works certainly well. It accidentally improves my baseball by a lot.','2021-12-19 17:47:12'),(64,12,6,1,'i use it never when i\'m in my nightclub.','2021-12-27 01:44:04'),(65,12,9,5,'I tried to nail it but got strawberry all over it.','2021-12-18 10:11:18'),(66,12,2,3,'My baboon loves to play with it.','2021-12-22 16:20:43'),(67,12,4,5,'I tried to nail it but got strawberry all over it.','2021-12-27 21:46:10'),(68,12,10,3,'My co-worker Ali has one of these. He says it looks towering.','2021-12-27 06:25:08'),(69,12,5,5,'The box this comes in is 3 light-year by 5 meter and weights 10 ounce!','2021-12-22 09:23:36'),(70,13,7,5,'My jaguar loves to play with it.','2021-12-27 22:19:06'),(71,13,2,3,'i use it barely when i\'m in my store.','2021-12-28 06:01:09'),(72,13,10,2,'The box this comes in is 4 kilometer by 5 mile and weights 17 gram.','2021-12-27 05:44:53'),(73,13,9,5,'works okay.','2021-12-21 05:17:28'),(74,13,3,2,'My co-worker Alek has one of these. He says it looks white.','2021-12-22 03:49:05'),(76,14,1,4,'My neighbor Germaine has one of these. She works as a salesman and she says it looks red.','2021-12-29 20:16:48'),(77,14,10,3,'heard about this on new jersey hip hop radio, decided to give it a try.','2021-12-26 06:31:53'),(78,14,4,3,'My tyrannosaurus rex loves to play with it.','2021-12-25 14:25:28'),(79,14,5,5,'talk about surprise!!!','2021-12-18 23:08:08'),(81,14,7,3,'one of my hobbies is skydiving. and when i\'m skydiving this works great.','2021-12-19 20:15:45'),(82,15,1,5,'i use it biweekly when i\'m in my greenhouse.','2021-12-21 14:53:00'),(84,15,4,5,'I tried to annihilate it but got bonbon all over it.','2021-12-24 15:08:28'),(85,15,9,1,'The box this comes in is 3 kilometer by 5 inch and weights 13 ton.','2021-12-23 21:36:09'),(88,16,7,3,'My neighbor Julisa has one of these. She works as a bartender and she says it looks crooked.','2021-12-22 13:57:25'),(89,16,5,3,'My bass loves to play with it.','2021-12-17 17:01:36'),(93,16,6,3,'My co-worker Luka has one of these. He says it looks purple.','2021-12-29 18:57:57'),(95,17,6,1,'i use it never when i\'m in my hotel.','2021-12-26 03:53:27'),(97,17,7,3,'My Shih-Tzu loves to play with it.','2021-12-26 22:42:15'),(98,17,8,1,'My co-worker Ali has one of these. He says it looks towering.','2021-12-28 17:03:59'),(99,17,4,4,'My beagle loves to play with it.','2021-12-18 11:49:37'),(100,18,1,2,'My neighbor Krista has one of these. She works as a salesman and she says it looks soapy.','2021-12-18 02:32:36'),(101,18,6,4,'My tyrannosaurus rex loves to play with it.','2021-12-18 19:50:37'),(102,18,9,3,'This product works certainly well. It excitedly improves my football by a lot.','2021-12-23 14:11:45'),(104,18,4,3,'I tried to shatter it but got potato all over it.','2021-12-27 06:17:53'),(106,19,6,5,'It only works when I\'m Kuwait.','2021-12-19 15:22:08'),(107,19,2,2,'It only works when I\'m Heard Island and McDonald Islands.','2021-12-16 23:39:31'),(108,19,7,3,'My co-worker Houston has one of these. He says it looks invisible.','2021-12-23 18:47:37'),(110,19,1,1,'this product is ratty.','2021-12-17 02:13:49'),(111,19,10,4,'SoCal cockroaches are unwelcome, crafty, and tenacious. This product keeps them away.','2021-12-26 00:57:25'),(112,20,7,3,'My hummingbird loves to play with it.','2021-12-20 16:42:06'),(113,20,4,3,'My co-worker Kazuo has one of these. He says it looks transparent.','2021-12-23 03:14:42'),(115,20,6,2,'this product is complimentary.','2021-12-17 04:30:29'),(116,20,2,4,'this product is mellow.','2021-12-27 14:58:00'),(118,21,7,4,'This product works really well. It wildly improves my baseball by a lot.','2021-12-28 13:17:24'),(119,21,5,4,'This product works outstandingly well. It beautifully improves my basketball by a lot.','2021-12-27 13:18:31'),(120,21,3,4,'It only works when I\'m Nepal.','2021-12-21 21:16:50'),(122,21,2,1,'heard about this on smooth jazz radio, decided to give it a try.','2021-12-26 20:11:24'),(123,21,4,5,'My co-worker Linnie has one of these. He says it looks wide.','2021-12-16 08:18:12'),(124,22,6,1,'one of my hobbies is mushroom cultivation. and when i\'m cultivating mushrooms this works great.','2021-12-26 23:33:13'),(125,22,3,4,'I tried to cremate it but got Turkish Delight all over it.','2021-12-27 15:27:59'),(126,22,7,2,'heard about this on smooth jazz radio, decided to give it a try.','2021-12-27 01:16:43'),(129,22,2,2,'The box this comes in is 4 light-year by 5 inch and weights 11 megaton!!','2021-12-25 05:41:26'),(130,23,9,3,'My co-worker Reed has one of these. He says it looks microscopic.','2021-12-28 11:43:47'),(131,23,2,4,'My neighbor Aldona has one of these. She works as a butler and she says it looks humongous.','2021-12-22 12:10:58'),(132,23,1,1,'The box this comes in is 3 meter by 5 foot and weights 11 kilogram.','2021-12-24 20:19:56'),(133,23,6,4,'talk about pleasure!','2021-12-26 11:43:15'),(134,23,4,1,'My bass loves to play with it.','2021-12-27 16:12:50'),(135,23,3,2,'My co-worker Houston has one of these. He says it looks invisible.','2021-12-28 16:30:52'),(137,24,9,1,'I tried to grab it but got bonbon all over it.','2021-12-20 15:45:10'),(139,24,1,1,'I tried to pepper it but got prune all over it.','2021-12-16 06:08:26'),(140,24,7,4,'I saw one of these in Macau and I bought one.','2021-12-19 14:02:08'),(141,24,2,4,'This product works considerably well. It recklessly improves my basketball by a lot.','2021-12-18 22:21:46'),(142,25,10,4,'i use it never again when i\'m in my station.','2021-12-19 16:18:53'),(143,25,3,5,'My neighbor Betha has one of these. She works as a teacher and she says it looks wide.','2021-12-25 09:05:33'),(144,25,6,2,'SoCal cockroaches are unwelcome, crafty, and tenacious. This product keeps them away.','2021-12-23 15:07:33'),(145,25,4,2,'this product is tasty.','2021-12-25 18:57:32'),(147,25,5,1,'My scarab beetle loves to play with it.','2021-12-17 13:51:10'),(148,26,6,2,'this Coca-Cola is whole-grain.','2021-12-30 03:47:52'),(149,26,4,2,'heard about this on chicha radio, decided to give it a try.','2021-12-25 20:02:16'),(151,26,5,1,'i use it on Mondays when i\'m in my fort.','2021-12-18 15:30:30'),(152,27,6,2,'My co-worker Delton has one of these. He says it looks slender.','2021-12-23 13:56:25'),(153,27,4,2,'My co-worker Kazuo has one of these. He says it looks transparent.','2021-12-17 17:47:03'),(155,27,5,1,'My scarab beetle loves to play with it.','2021-12-23 05:47:26'),(156,28,6,2,'SoCal cockroaches are unwelcome, crafty, and tenacious. This product keeps them away.','2021-12-24 18:26:19'),(157,28,4,2,'I saw one of these in French Southern and Antarctic Lands and I bought one.','2021-12-23 21:25:44'),(159,28,5,1,'My scarab beetle loves to play with it.','2021-12-28 18:29:56'),(160,29,6,2,'SoCal cockroaches are unwelcome, crafty, and tenacious. This product keeps them away.','2021-12-26 19:47:41'),(161,29,4,2,'this product is tasty.','2021-12-17 14:05:06'),(163,29,5,1,'My scarab beetle loves to play with it.','2021-12-27 04:35:23'),(167,23,15,3,'asdfasdf','2022-02-04 06:37:50'),(169,27,15,5,'this is a great product','2022-02-06 08:14:38'),(173,11,15,3,'yay','2022-02-11 05:19:52'),(174,18,15,5,'sd','2022-02-11 05:20:43');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(35) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Customer',
  `profile_pic_url` varchar(10000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Charles D Nelson','ayana_ernse0@yahoo.com','06913783','theman','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-27 18:17:09'),(2,'Pilar A Koehler','joanie_schneid@gmail.com','43106322','quei2Akie','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-24 19:34:05'),(3,'Samuel Jeff','samuel_jeff13@gmail.com','91723922','babygirl','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-24 13:35:28'),(4,'Billy Irish','jalen1995@gmail.com','50032767','peter','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-18 03:51:31'),(5,'Geoffrey Godman','modesto2010@hotmail.com','33542403','walter','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-28 21:07:37'),(6,'Beamu Sephu','etha1984@yahoo.com','01265160','smooth','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-17 16:40:00'),(7,'Andra Wellbeck','elza2006@yahoo.com','70484692','westside','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-27 14:33:37'),(8,'Gasby Giff','letitia2013@gmail.com','49247116','nikita','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-26 17:24:33'),(9,'Karen Yuri','jevon_wehne4@yahoo.com','93547872','pimpin','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-20 13:58:23'),(10,'Wong Yu Me','eugene1973@gmail.com','07095786','252525','Customer','https://www.imgur.com/myProfilePic.jpg','2021-12-20 12:14:43'),(11,'kenneth','kenneth@gmail.com','12345123','kenneth','Admin','https://www.imgur.com/myProfilePic.jpg','2021-12-20 12:14:43'),(12,'Amin Nik Strater','amin@amail.com','6054756961','password','Admin','http://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg','2022-01-28 13:29:36'),(13,'Custer Mah','custer@cmail.com','5555555','password','Customer','http://cdn5.vectorstock.com/i/1000x1000/18/39/shopper-icon-with-male-customer-person-profile-vector-25841839.jpg','2022-01-28 13:30:04'),(15,'sam','sam@gmail.com','1298491824','sam123','Customer','sam','2022-02-04 06:37:40');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinterest`
--

DROP TABLE IF EXISTS `userinterest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinterest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userid` int NOT NULL,
  `fk_categoryid` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_userid` (`fk_userid`,`fk_categoryid`),
  KEY `fk_categoryid` (`fk_categoryid`),
  CONSTRAINT `userInterest_ibfk_1` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `userInterest_ibfk_2` FOREIGN KEY (`fk_categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinterest`
--

LOCK TABLES `userinterest` WRITE;
/*!40000 ALTER TABLE `userinterest` DISABLE KEYS */;
INSERT INTO `userinterest` VALUES (1,1,3,'2021-12-20 00:36:48'),(4,1,1,'2021-12-17 12:21:33'),(7,3,1,'2021-12-16 19:45:43'),(9,3,6,'2021-12-25 19:14:17'),(10,3,7,'2021-12-29 06:50:52'),(16,5,6,'2021-12-16 08:48:12'),(17,5,7,'2021-12-21 08:40:46'),(18,6,1,'2021-12-27 11:35:41'),(20,6,3,'2021-12-18 20:32:15'),(23,7,1,'2021-12-18 00:14:06'),(25,7,3,'2021-12-27 12:56:09'),(26,7,7,'2021-12-17 23:51:57'),(27,8,3,'2021-12-19 03:07:48'),(30,8,6,'2021-12-21 11:11:50'),(31,8,7,'2021-12-28 07:03:11'),(32,9,1,'2021-12-18 20:16:51'),(67,4,1,'2022-02-04 10:09:47'),(77,4,3,'2022-02-04 18:38:38'),(104,15,10,'2022-02-11 05:21:28'),(105,15,12,'2022-02-11 05:21:28');
/*!40000 ALTER TABLE `userinterest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'spit'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-15 21:04:14
