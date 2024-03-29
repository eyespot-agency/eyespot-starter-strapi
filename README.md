<h1 align="center">
  Eyespot Starter Strapi
</h1>

Strapi starter reflecting the Eyespot standards and conventions.

# Essential rules

- Code must be linted and formatted
- Do not leave irrelevant trailing comments or commented code blocks
- Do not leave unused files or assets
- Don't use `eslint-disable` nor change config files for linting and formatting (except for rare agreed exceptions)
- Code must be pushed whenever possible, at least once every worked days

# Setup

## Prerequisites

- Install `hygen` globally
- Make sure you have an up-to-date NodeJS install (>= 12, <= 16)
- Prefer Unix-based environments to Windows
- Preferably VSCode with recommended extensions supplied in `.vscode/extensions`

## Local development server setup

- Create a Postgres database according to the config supplied in `.env.development`

  - Name: `strapi_db_development`
  - User: `strapi_dbuser` with password `password`

- Run `yarn`
- After dependency installation, run `yarn develop` (local development mode)
- Change permissions for the local database reset script in order to easily and productivly reset projects: `chmod +x ./scripts/db-reset.sh`

**Important notes**

- Although Strapi comes with `sqlite` for local development, we do not use it at Eyespot
- When adding dependencies or updating them, use `yarn` and not `npm`
- Change permissions for the local database reset script in order to easily and productivly reset projects: `chmod +x ./scripts/db-reset.sh`

# Folder structure

Standard Strapi folder structure

# Linting and formatting

- Uses ESLint and Prettier working in pair together
- Linting and formatting are enforced (won't compile unless addressed)
- Formatting/Linting is automatically processed on saving files. If linting errors remain unresolved, commit won't go through
- In fact, linting and formatting tasks are also
  installed as a pre-commit hook through Husky

# Committing code

- Follows the [_Conventional Committing_](https://www.conventionalcommits.org/en/v1.0.0/) standard

- Feature example: `git commit -m "feat: Closes ISS-1. Ability to login with Apple"`
- Patch example: `git commit -m "fix: Closes ISS-2 and corrects scrolling bug"`
- Major/Breaking change example: `git commit -m "BREAKING CHANGE: Updated website version"`
- Combines feature and breaking change:
- Major/Breaking change example:

  `git commit -m "feat: Closes ISS-1. Ability to login with Apple BREAKING CHANGE: Updated Gatsby version"`

- Commits not impacting versioning:

  - Regular / casual example: `git commit -m "chore: ISS-4 Installed dependencies"`
  - Refactoring example: `git commit -m "refactoring: Refactored component"`
  - Other commit types: _build:, chore:, ci:, docs:, style:, refactor:, perf:, test_

- The standard is linted and Husky will prevent commits from going through if it's not compliant
- Project managers/owners can release satisfying updates and issue version bumps thanks to [standard-version](https://github.com/conventional-changelog/standard-version) by running `yarn release`. This will generate:
- Appropriate tags based on the conventional commit history
- An aggregated `CHANGELOG.md` file update.
