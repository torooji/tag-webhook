import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;

  constructor(githubToken: string) {
    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  async createIssue(params: {
    owner: string;
    repo: string;
    title: string;
    body: string;
  }): Promise<void> {
    try {
      await this.octokit.issues.create({
        owner: params.owner,
        repo: params.repo,
        title: params.title,
        body: params.body,
      });
      console.log(`Issue created successfully in ${params.repo}`);
    } catch (error) {
      console.error("Failed to create GitHub issue:", error);
      throw error;
    }
  }
}
