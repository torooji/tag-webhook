# Tag Monitor Webhook

## Submission Notes

This project provides a webhook that monitors GitHub tag creation. When a tag is created in a repository, a corresponding issue is created in the same repository.

> **NOTE:** For the purpose of this exercise, I committed the source code and configured the webhook within the same repository. This is not required but I figured it makes submission and discussion a little bit easier.

### Tools and Technologies used

#### ngrok

Using the assignment's hint as a starting point, I began development using ngrok. I briefly explored alternatives such as pinggy.io, replit, webhook.site. In a real world situation I would invest more time to choosing the most appropriate tunneling service by looking more closely at cost, functionality, etc. Since I have never used one of these services, I would spend some time on due diligence to learn the best tool for my needs.

#### HMAC

The webhook's signature validation is performed by using Node's `crypto.timingSafeEqual()` method to compare the expected and actual HMAC signatures. This approach follows GitHub's recommendations outlined on the [Validating Deliveries](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) guide.

#### dotenv

I used dotenv to store my GitHub access token and webhook secret locally, preventing me from accidentally sharing tokens that should be kept private.

#### octokit

Communication with GitHub is handled by octokit. This approach follow's GitHub's recommendations outlined on the [Quickstart for GitHub REST API](https://docs.github.com/en/rest/quickstart?apiVersion=2022-11-28)

## Local Development Setup

### Create dev environment

1. Checkout the git repo

```console
tinaorooji@Tinas-MacBook-Air workspace % gh repo clone torooji/tag-webhook

tinaorooji@Tinas-MacBook-Air workspace % cd tag-webhook
```

2. Create a local .env file

```
GITHUB_TOKEN=<your GitHub user's access token>
WEBHOOK_SECRET=<the secret used to configure the repo's webhook>
PORT=3000
```

3. Install dependencies

```console
npm install
```

### Run locally

1. Run the application locally

```console
npm run start:dev
```

2. Use ngrok to expose the local server

```console
tinaorooji@Tinas-MacBook-Air ~ % ngrok http --url=cuddly-monitor-forcibly.ngrok-free.app 3000
```

## Execute webhook

1. Publish a tag

```console
tinaorooji@Tinas-MacBook-Air tag-webhook % git tag release-3
tinaorooji@Tinas-MacBook-Air tag-webhook % git push origin release-3
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/torooji/tag-webhook.git
 * [new tag]         release-3 -> release-3
```

2.  Observe the ngrok output

```console
19:20:35.041 PST POST /webhook                  200 OK
```

3. Observe node console log

```console
Issue created successfully in tag-webhook
```

4. Verify issue creation

```console
tinaorooji@Tinas-MacBook-Air tag-webhook % gh issue list

Showing 1 of 1 open issue in torooji/tag-webhook

ID  TITLE                       LABELS  UPDATED
#4  New Tag Created: release-3          about 3 minutes ago
tinaorooji@Tinas-MacBook-Air tag-webhook %
```
