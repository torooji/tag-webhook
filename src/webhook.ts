import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import { GitHubService } from "./github";

export class WebhookHandler {
  private app: express.Application;
  private githubService: GitHubService;
  private webhookSecret: string;

  constructor(githubToken: string, webhookSecret: string) {
    this.app = express();
    this.githubService = new GitHubService(githubToken);
    this.webhookSecret = webhookSecret;

    // Middleware
    this.app.use(
      bodyParser.json({
        verify: (req: any, res, buf) => {
          req.rawBody = buf.toString();
        },
      })
    );

    this.app.use((req, res, next) => {
      next();
    });

    this.app.post("/webhook", this.verifyWebhookSignature, this.handleWebhook);
  }

  // Webhook signature verification middleware
  private verifyWebhookSignature = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // GitHub signature header
      const signature = req.get("X-Hub-Signature-256");

      // Raw request body
      const payload = req.rawBody;

      // Signature validation
      if (!signature) {
        console.warn("No GitHub signature provided");
        return res.status(403).json({
          error: "Forbidden",
          message: "No GitHub signature",
        });
      }

      // Generate expected signature
      const expectedSignature = `sha256=${crypto
        .createHmac("sha256", this.webhookSecret)
        .update(payload)
        .digest("hex")}`;

      // Timing-safe comparison
      const signatureMatch = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

      if (!signatureMatch) {
        console.warn("Signature mismatch");
        return res.status(403).json({
          error: "Forbidden",
          message: "Invalid GitHub signature",
        });
      }

      // Proceed to handler if signature is valid
      next();
    } catch (error) {
      console.error("Signature verification error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Signature verification failed",
      });
    }
  };

  // Webhook event handler
  private handleWebhook = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const event = req.get("X-GitHub-Event");

      // Only process ref/tag creation events
      if (event !== "create" || req.body.ref_type !== "tag") {
        return res.status(200).send("Ignored event");
      }

      const { repository, sender, ref } = req.body;

      // Create issue with tag details
      await this.githubService.createIssue({
        owner: repository.owner.login,
        repo: repository.name,
        title: `New Tag Created: ${ref}`,
        body: `A new tag \`${ref}\` was created by @${sender.login} in the \`${repository.full_name}\` repository.`,
      });

      res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).send("Internal server error");
    }
  };

  // Start the server
  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Webhook server running on port ${port}`);
    });
  }
}
