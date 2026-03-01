# Privacy Policy

**Last updated:** March 1, 2026

## Overview

Git Repo Analyzer is a Chrome Extension, CLI tool, and web application that analyzes public GitHub repositories. Your privacy is important to us. This policy explains what data we collect (very little) and how it is handled.

## Data Collection

**We do not collect, store, or transmit any personal data to our servers.**

### GitHub API Requests

All analysis is performed locally — in your browser (web app and extension) or on your machine (CLI). The app makes requests directly from your device to the [GitHub REST API](https://docs.github.com/en/rest) to fetch publicly available repository data such as commits, contributors, languages, and file structure. No data is routed through any intermediary server.

### GitHub Personal Access Token

You may optionally provide a GitHub Personal Access Token to access private repositories or increase API rate limits. This token is:

- Used **only** for the duration of the browser session or CLI command and is **not** persisted
- Sent **only** to GitHub's API (`api.github.com`) in the `Authorization` header
- **Never** transmitted to any other server or third party

### Local Storage

The web app and Chrome Extension use browser `localStorage` to persist:

- Analysis history and cached results
- User preferences

This data never leaves your device.

### Chrome Extension Permissions

The extension requests the following permissions:

- **`activeTab`** — To detect the GitHub repository URL of the currently active tab
- **`storage`** — To persist analysis history locally
- **`sidePanel`** — To display the analysis UI in Chrome's side panel

No other permissions are requested. The extension does not read or modify web page content beyond detecting the URL.

## Third-Party Services

The only external service this application communicates with is the **GitHub REST API** (`api.github.com`). Please refer to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) for their data handling practices.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected in the "Last updated" date above.

## Contact

If you have questions about this Privacy Policy, please [open an issue](https://github.com/tayles/git-repo-analyzer/issues) on the GitHub repository.
