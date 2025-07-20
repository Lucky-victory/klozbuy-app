CREATE INDEX `users_email_verified_idx` ON `users` (`email_verified`);--> statement-breakpoint
CREATE INDEX `users_phone_verified_idx` ON `users` (`phone_number_verified`);--> statement-breakpoint
CREATE INDEX `users_is_verified_idx` ON `users` (`is_verified`);