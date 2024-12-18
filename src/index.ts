// src/index.ts
import { WebhookHandler } from "./webhook";
import { config } from "./config";

// Validate environment variables
config.validate();

const webhookHandler = new WebhookHandler(
  config.githubToken!,
  config.webhookSecret!
);
webhookHandler.listen(config.port);
