# MCP_COURSE

A learning repository documenting my progress through the MCP (Model Context Protocol) course. It holds my notes, exercises, and code as I work through each section of the program.

## About

This repo tracks the hands-on work for the course, starting with Git & GitHub fundamentals and building up to working with the Model Context Protocol. Each section is committed as I complete it, so the history reflects my learning journey.

## Prerequisites

Before running anything in this repo, make sure you have:

- [Git](https://git-scm.com/) installed
- A code editor such as [VS Code](https://code.visualstudio.com/)

## How to Run / Use This Repo

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohHamayl2004/MCP_COURSE.git
   ```

2. **Open the folder**
   ```bash
   cd MCP_COURSE
   code .
   ```

3. **Explore the contents** — browse the files and folders to follow along with each course section.

> As the course progresses, run instructions for specific projects will be added to their own folders.

## Tests

Smoke tests cover the pure helper functions — CSV escaping and parsing, filtering,
monthly summaries, id generation and output caps. They use Node's built-in test runner,
so there's nothing extra to install.

```bash
npm test
```

Current status: **23 tests passing**. The MCP transport itself isn't unit tested; that's
covered manually through Inspector in `docs/test-plan.md`.

## Course Structure

- **1.2 Git & GitHub kickoff** — set up this repository, practiced staging, committing, and pushing changes.
- *(More sections will be added as the course continues.)*

## Academy

This project is part of my coursework at the academy. Learn more here:
[Academy Website](https://REPLACE-WITH-ACADEMY-URL.com)

## Author

**Mohammad Hamayel**
GitHub: [@MohHamayl2004](https://github.com/MohHamayl2004)