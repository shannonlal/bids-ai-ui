# GitHub Integration

## Overview

The GitHub integration is implemented through a dedicated MCP (Model Context Protocol) server that provides tools for interacting with GitHub's API. This approach ensures consistent and programmatic access to GitHub functionality without relying on browser-based interactions.

## GitHub MCP Server

### Server Configuration

The GitHub MCP server should be configured in the MCP settings file with the following environment variables:

- `GITHUB_TOKEN`: Personal access token with appropriate repository permissions
- `GITHUB_OWNER`: Repository owner/organization name
- `GITHUB_REPO`: Repository name

### Available Tools

#### create_pull_request

Creates a new pull request on GitHub.

```typescript
{
  sourceBranch: string;  // Branch containing changes
  targetBranch: string;  // Branch to merge into (default: main)
  title: string;         // PR title
  body: string;         // PR description
  draft?: boolean;      // Create as draft PR (default: false)
}
```

#### list_pull_requests

Lists open pull requests.

```typescript
{
  state?: "open" | "closed" | "all";  // Filter by PR state
  limit?: number;                     // Maximum number of PRs to return
}
```

#### update_pull_request

Updates an existing pull request.

```typescript
{
  number: number;       // PR number
  title?: string;      // New title
  body?: string;       // New description
  state?: string;      // New state (open/closed)
}
```

### Resources

#### pull_request_template

Access the repository's pull request template.
URI: `github://templates/pull_request`

#### branch_info

Get information about a specific branch.
URI Template: `github://branches/{branch_name}`

## Usage Guidelines

1. **Pull Request Creation**

   - Use the `create_pull_request` tool instead of browser-based PR creation
   - Automatically populate PR description using the pull request template
   - Include relevant labels and assignees

2. **Branch Management**

   - Use Git CLI commands for local branch operations
   - Use MCP tools for remote branch operations that require GitHub API interaction

3. **Review Process**
   - Use MCP tools to programmatically manage PR reviews
   - Automate PR updates based on review feedback

## Benefits

1. **Consistency**: Programmatic API access ensures consistent PR creation and management
2. **Automation**: Easier integration with CI/CD workflows
3. **Security**: No need to handle browser sessions or cookies
4. **Performance**: Direct API access is faster than browser automation

## Error Handling

The MCP server implements robust error handling for common scenarios:

- Invalid credentials
- Rate limiting
- Network issues
- Permission errors

Each error includes detailed information to help diagnose and resolve the issue.
