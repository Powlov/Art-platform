CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`videoUrl` text,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`message` text,
	`status` enum('pending','accepted','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messageRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('message_request','message','artwork_sold','auction_bid','news','follow') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`relatedUserId` int,
	`relatedArtworkId` int,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `artworks` ADD `genre` varchar(100);--> statement-breakpoint
ALTER TABLE `artworks` ADD `qrCode` text;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(12);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyShowName` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyShowAvatar` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyShowBio` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyShowCollection` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyShowBlog` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `privacyAllowMessages` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);