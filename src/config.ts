// src/config.ts
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  githubToken: process.env.GITHUB_TOKEN,
  webhookSecret: process.env.WEBHOOK_SECRET,
  port: parseInt(process.env.PORT || "3000", 10),

  validate() {
    const missingVars = [
      { name: "GITHUB_TOKEN", value: this.githubToken },
      { name: "WEBHOOK_SECRET", value: this.webhookSecret },
    ].filter((v) => !v.value);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars
          .map((v) => v.name)
          .join(", ")}`
      );
    }
  },
};
