CREATE TABLE `artists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` text,
	`profileImage` text,
	`website` varchar(255),
	`socialMedia` json,
	`followers` int DEFAULT 0,
	`totalSales` int DEFAULT 0,
	`totalRevenue` decimal(15,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artworks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`artistId` int NOT NULL,
	`galleryId` int,
	`year` int,
	`technique` varchar(255),
	`dimensions` varchar(100),
	`medium` varchar(255),
	`basePrice` decimal(15,2),
	`currentPrice` decimal(15,2),
	`imageUrl` text,
	`status` enum('available','sold','auction','unavailable') DEFAULT 'available',
	`blockchainVerified` boolean DEFAULT false,
	`blockchainHash` varchar(255),
	`ipfsHash` varchar(255),
	`uniqueId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artworks_id` PRIMARY KEY(`id`),
	CONSTRAINT `artworks_uniqueId_unique` UNIQUE(`uniqueId`)
);
--> statement-breakpoint
CREATE TABLE `auctions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`startPrice` decimal(15,2) NOT NULL,
	`currentBid` decimal(15,2),
	`highestBidderId` int,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
	`bidsCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auctions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`auctionId` int NOT NULL,
	`bidderId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` text,
	`profileImage` text,
	`portfolioValue` decimal(15,2) DEFAULT '0',
	`artworksCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collectors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galleries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(255),
	`logo` text,
	`members` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landingPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`templateId` varchar(100),
	`content` json,
	`isPublished` boolean DEFAULT false,
	`url` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landingPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `landingPages_url_unique` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` text NOT NULL,
	`type` enum('text','file','artwork_link') DEFAULT 'text',
	`fileUrl` text,
	`artworkId` int,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('artwork','artist','style','market','general') NOT NULL,
	`relatedArtworkId` int,
	`relatedArtistId` int,
	`source` varchar(255),
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provenance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`ownerId` int NOT NULL,
	`acquiredDate` timestamp NOT NULL,
	`price` decimal(15,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `provenance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`sellerId` int NOT NULL,
	`buyerId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`type` enum('sale','auction','transfer') NOT NULL,
	`status` enum('pending','completed','cancelled') DEFAULT 'pending',
	`transactionHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`artworkId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','artist','collector','gallery','partner','curator','consultant') NOT NULL DEFAULT 'user';