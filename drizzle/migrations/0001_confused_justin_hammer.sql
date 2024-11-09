CREATE TABLE `user_friend` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id_1` text NOT NULL,
	`user_id_2` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`user_id_1`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id_2`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
