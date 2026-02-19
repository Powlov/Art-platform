CREATE TABLE `artworkEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`eventId` int NOT NULL,
	`participationType` enum('exhibited','sold','featured') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artworkEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artworkViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`userId` int,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artworkViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('exhibition','auction','discussion','workshop','other') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`location` varchar(255),
	`organizerId` int,
	`imageUrl` text,
	`status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`partnerId` int NOT NULL,
	`type` enum('gallery','producer','copyRights','consultant','partner') NOT NULL,
	`status` enum('active','inactive','pending') DEFAULT 'pending',
	`description` text,
	`commission` decimal(5,2),
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`price` decimal(15,2) NOT NULL,
	`changePercent` decimal(5,2),
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `priceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`walletId` int NOT NULL,
	`type` enum('deposit','withdrawal','payment','refund','commission') NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`description` text,
	`relatedTransactionId` int,
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` decimal(15,2) DEFAULT '0',
	`currency` varchar(10) DEFAULT 'USD',
	`cardConnected` boolean DEFAULT false,
	`cardLastFour` varchar(4),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
