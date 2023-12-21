-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: test_production
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `authentication`
--

DROP TABLE IF EXISTS `authentication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int DEFAULT NULL,
  `userName` varchar(245) DEFAULT NULL,
  `password` varchar(245) DEFAULT NULL,
  `roleTypeId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication`
--

LOCK TABLES `authentication` WRITE;
/*!40000 ALTER TABLE `authentication` DISABLE KEYS */;
INSERT INTO `authentication` VALUES (1,1,'admin@scandexbd.com','sha1$cfd462ed$1$73231600a63e0cfc494e27c960d754ea5b7ff91a',1,0,1,1,0,1,'2023-11-26 09:04:19',NULL,NULL),(2,2,'karthidevan08@gmail.com','sha1$45fc6d56$1$9ed82940971056ebd378f45d4da2d4f5dd28c260',NULL,1,1,1,0,1,'2023-11-27 00:23:59',NULL,NULL);
/*!40000 ALTER TABLE `authentication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `authId` int DEFAULT NULL,
  `employeeCode` varchar(245) DEFAULT NULL,
  `name` varchar(245) DEFAULT NULL,
  `email` varchar(245) DEFAULT NULL,
  `phone` varchar(245) DEFAULT NULL,
  `address` text,
  `roleTypeId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,1,NULL,'Admin','admin@scandexbd.com','880-2-7692194',NULL,1,0,1,1,0,1,'2023-11-26 09:06:56',1,'2023-11-26 03:36:56'),(2,NULL,'00002','karthikeyan','karthidevan08@gmail.com','8883082088','kumbakonam',2,1,1,1,0,1,'2023-11-27 00:23:59',1,'2023-11-26 18:57:34');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(245) DEFAULT NULL,
  `address` text,
  `currency` int DEFAULT NULL,
  `timeZone` int DEFAULT NULL,
  `organizationLogo` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;
INSERT INTO `organization` VALUES (1,'Scandex (BD) Ltd','Gouripur, Ashulia, Savar, Dhaka - 1340',18,0,NULL,1,0,1,'2023-05-17 20:48:58',NULL,NULL);
/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profileName` varchar(245) DEFAULT NULL,
  `masters` json DEFAULT NULL,
  `workOrders` json DEFAULT NULL,
  `fabricRolls` json DEFAULT NULL,
  `garmentBundles` json DEFAULT NULL,
  `rollsEntry` json DEFAULT NULL,
  `bundlesEntry` json DEFAULT NULL,
  `reports` json DEFAULT NULL,
  `dashboards` json DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (1,'Full access','{\"role\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"profile\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"employee\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"organization\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"workOrders\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"fabricRolls\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"garmentBundles\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"rollsEntry_1\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_2\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_3\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_4\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_5\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_6\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"rollsEntry_7\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"bundlesEntry_1\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"bundlesEntry_2\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"bundlesEntry_3\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"reports\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"dashboards\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}',1,1,0,1,'2023-11-26 23:22:48',NULL,NULL),(2,'master access','{\"role\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"profile\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"employee\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}, \"organization\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"workOrders\": {\"creation\": true, \"deletion\": true, \"updation\": true, \"selection\": true}}','{\"fabricRolls\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}','{\"garmentBundles\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}','{\"rollsEntry_1\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_2\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_3\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_4\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_5\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_6\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"rollsEntry_7\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}','{\"bundlesEntry_1\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"bundlesEntry_2\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}, \"bundlesEntry_3\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}','{\"reports\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}','{\"dashboards\": {\"creation\": false, \"deletion\": false, \"updation\": false, \"selection\": false}}',1,1,0,1,'2023-11-26 23:27:41',1,'2023-11-26 17:59:29');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_type`
--

DROP TABLE IF EXISTS `role_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_type`
--

LOCK TABLES `role_type` WRITE;
/*!40000 ALTER TABLE `role_type` DISABLE KEYS */;
INSERT INTO `role_type` VALUES (1,'Admin'),(2,'Employee');
/*!40000 ALTER TABLE `role_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'sub-admin',1,1,0,1,'2023-11-26 23:45:11',NULL,NULL),(2,'sub-admin-1',1,1,0,1,'2023-11-26 23:46:31',NULL,NULL),(3,'sub-admin-2',1,1,0,1,'2023-11-27 00:17:54',1,'2023-11-26 18:49:09');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_profile`
--

DROP TABLE IF EXISTS `roles_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int DEFAULT NULL,
  `profileId` int DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `delStatus` tinyint(1) DEFAULT '0',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_profile`
--

LOCK TABLES `roles_profile` WRITE;
/*!40000 ALTER TABLE `roles_profile` DISABLE KEYS */;
INSERT INTO `roles_profile` VALUES (1,1,1,1,1,0,1,'2023-11-26 23:45:11',NULL,NULL),(2,1,2,1,1,0,1,'2023-11-26 23:45:11',NULL,NULL),(4,2,1,1,1,0,1,'2023-11-26 23:46:31',NULL,NULL),(6,3,1,1,1,0,1,'2023-11-27 00:19:09',NULL,NULL);
/*!40000 ALTER TABLE `roles_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'test_production'
--

--
-- Dumping routines for database 'test_production'
--
/*!50003 DROP PROCEDURE IF EXISTS `pauthenticateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pauthenticateUser`(IN `pUsername` VARCHAR(255))
BEGIN
    SELECT 
        auth.id,
        auth.employeeId,
        auth.userName,
        auth.password,
        auth.roleId,
        auth.orgId,
        auth.status,
        auth.roleTypeId,
        emp.name,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', auth.roleId,
                'masters', p.masters,
                'workOrders', p.workOrders,
                'fabricRolls', p.fabricRolls,
                'garmentBundles', p.garmentBundles,
                'rollsEntry', p.rollsEntry,
                'bundlesEntry', p.bundlesEntry,
                'reports', p.reports,
                'dashboards', p.dashboards
            )
        ) AS customRole
    FROM authentication auth
    LEFT JOIN employee emp ON emp.id = auth.employeeId AND emp.orgId = auth.orgId
    LEFT JOIN roles_profile rp ON rp.roleId = emp.roleId AND rp.orgId = emp.orgId
    LEFT JOIN organization op ON op.id = emp.orgId AND organizationLogo = 0
    LEFT JOIN profile p ON p.id = rp.profileId AND p.orgId = rp.orgId
    WHERE (auth.UserName = pUsername OR emp.employeeCode = pUsername)
    GROUP BY auth.id, auth.employeeId, auth.userName, auth.password, auth.roleId, auth.orgId, auth.status, emp.name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pdelete_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pdelete_employee`(
IN `pid` int,
IN `ploginId` int,
IN `porgId` int)
BEGIN

update employee set delStatus = 1, modifiedBy = ploginId, modifiedAt = now() where id = pid and orgId = porgId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pdelete_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pdelete_profile`(
IN `pid` int,
IN `ploginId` int,
IN `porgId` int)
BEGIN
update profile set 
delStatus = 1,
modifiedBy = ploginId,
modifiedAt = now() where id = pid and orgId = porgId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pdelete_role` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pdelete_role`(
IN `pid` int,
IN `ploginId` int,
IN `porgId` int)
BEGIN

update roles set delStatus = 1, modifiedBy = ploginId, modifiedAt = now() where id = pid and orgId = porgId;
update roles_profile set delStatus = 1, modifiedBy = ploginId, modifiedAt = now() where roleId = pid and orgId = porgId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pgetall_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pgetall_employee`(IN `porgId` int)
BEGIN

select e.id,e.authId,e.employeeCode,e.name,e.email,e.phone,e.address,e.roleTypeId,e.roleId
from employee e
where e.orgId = porgId and e.status = 1 and e.delStatus = 0 and e.roleTypeId <> 1 ;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pgetall_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pgetall_profile`(IN `porgId` int)
BEGIN
select s.id,s.profileName,s.masters, s.workOrders,  s.fabricRolls,  s.garmentBundles,  s.rollsEntry,  s.bundlesEntry,  s.reports,  s.dashboards  from profile s
where s.orgId = porgId and s.status = 1 and s.delStatus = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pgetall_role` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pgetall_role`(IN `porgId` int)
BEGIN

SELECT r.id,r.name,
       JSON_ARRAYAGG(
      JSON_OBJECT(
        'profileName', p.profileName 
      )	
    )
   AS profiles
FROM  roles r
LEFT JOIN roles_profile rp ON rp.roleId = r.id
LEFT JOIN profile p ON p.id = rp.profileId
WHERE r.orgId = porgId AND r.status = 1 and r.delStatus = 0
GROUP BY r.id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ppost_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ppost_employee`(
IN `pid` int(11),
IN `pemployeeCode` varchar(245), 
IN `pname` varchar(245),  
IN `pemail` varchar(245), 
IN `pphone` varchar(245), 
IN `ppassword` varchar(245), 
IN `paddress` text,
IN `proleId` int, 
IN `ploginId` int,
IN `porgId` int)
BEGIN

DECLARE  pemployeeId INT;
if(pid = 0) then
if not exists(select id from employee where email = pemail) then

INSERT INTO employee (name,employeeCode,email,phone,address,roleTypeId,roleId,orgId,createdBy,createdAt)
VALUES (pname,pemployeeCode,pemail,pphone,paddress,2,proleId,porgId,ploginId,now());
set pemployeeId = (SELECT LAST_INSERT_ID());

Insert into authentication(employeeId,userName,password,roleId,orgId,createdBy,createdAt)
VALUES (pemployeeId,pemail,ppassword,proleId,porgId,ploginId,now());

END IF;
else

if not exists (select id from employee where email = pemail and id<>pid) then

UPDATE employee SET
name = pname,
employeeCode = pemployeeCode,
email = pemail,
phone = pphone,
address = paddress,
roleId = proleId,
orgId = porgId,
modifiedBy = ploginId,
modifiedAt = now() where id = pid and orgId = porgId;


UPDATE authentication SET userName = pemail where employeeId = pid and orgId = porgId;

END IF;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ppost_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ppost_profile`(
IN `pid` int,
IN `pprofileName` varchar(245),
IN `pmasters` json,
IN `pworkOrders` json,
IN `pfabricRolls` json,
IN `pgarmentBundles` json,
IN `prollsEntry` json,
IN `pbundlesEntry` json,
IN `preports` json,
IN `pdashboards` json,
IN `ploginId` int,
IN `porgId` int)
BEGIN
if(pid = 0) 
then
if not exists (select id from profile where profileName = pprofileName and orgId = porgId) 
then
insert into profile (profileName,masters,workOrders,fabricRolls,garmentBundles,rollsEntry,bundlesEntry,reports,dashboards,orgId,createdBy,createdAt)
values (pprofileName,pmasters,pworkOrders,pfabricRolls,pgarmentBundles,prollsEntry,pbundlesEntry,preports,pdashboards,porgId,ploginId,now());
end if;
else 
if not exists (select id from profile where profileName = pprofileName and orgId = porgId and id <> pid) 
then
update profile set 
profileName = pprofileName,
masters = pmasters,
workOrders = pworkOrders,
fabricRolls = pfabricRolls,
garmentBundles = pgarmentBundles,
rollsEntry = prollsEntry,
bundlesEntry = pbundlesEntry,
reports = preports,
dashboards = pdashboards,
orgId = porgId,
modifiedBy = ploginId,
modifiedAt = now() where id = pid and orgId = porgId;
end if;
end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ppost_roles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ppost_roles`(
IN `pid` int(11),
IN `pname` varchar(245),
IN `pprofileQuery` longtext,
IN `ploginId` int,
IN `porgId` int)
BEGIN

DECLARE proleId INT;

Drop temporary table if exists tmp_roles_profile;
CREATE temporary TABLE `tmp_roles_profile` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) Default NULL,
  `profileId` int(11) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

IF(pprofileQuery <> '')THEN
SET @s1 = pprofileQuery;
PREPARE stmt1 FROM @s1;
EXECUTE stmt1 ;
DEALLOCATE PREPARE stmt1;
END IF; 


if(pid = 0) then

if not exists(select id from roles where name = pname and orgId = porgId) then
INSERT INTO roles (name,orgId,createdBy,createdAt)
VALUES (pname,porgId,ploginId,now());
set proleId = (SELECT LAST_INSERT_ID());

IF EXISTS(Select id from tmp_roles_profile)THEN
Insert into roles_profile(roleId,profileId,orgId,createdBy,createdAt)
select proleId,profileId,porgId,ploginId,now() from tmp_roles_profile;
END IF;

END IF;
else

if not exists (select id from roles where name = pname and orgId = porgId and id<>pid) then

IF EXISTS(Select id from roles_profile where profileId NOT IN(Select profileId from tmp_roles_profile) AND roleId = pid AND orgId = porgId)THEN
Delete from roles_profile where profileId NOT IN (Select profileId from tmp_roles_profile) AND roleId = pid AND orgId = porgId;
END IF;

IF NOT EXISTS(select id from tmp_roles_profile)THEN
Delete from roles_profile where roleId = pid and orgId = porgId;
END IF;

IF EXISTS(Select id from tmp_roles_profile where profileId NOT IN (Select profileId from roles_profile where roleId = pid AND orgId = porgId))THEN
Insert into roles_profile(roleId, profileId, orgId, CreatedBy, CreatedAt)
select roleId,profileId,porgId,ploginId,now() from tmp_roles_profile where profileId NOT IN(Select profileId from roles_profile where roleId = pid AND orgId = porgId);
END IF;

UPDATE roles SET
name = pname,
orgId = porgId,
modifiedBy = ploginId,
modifiedAt = now() where id = pid and orgId = porgId;

END IF;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-27  7:07:29
