# Contributing to Process Pilot

Thank you for your interest in contributing to Process Pilot! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- A code editor (VS Code recommended)

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Process_Pilot_LIVE.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add types for all function parameters and return values

### Component Guidelines

- Place new components in `src/components/`
- Use shadcn/ui components when available
- Follow the existing component structure
- Use Tailwind CSS for styling

### Commits

Write clear, concise commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues when applicable

**Examples:**
```
Add user profile settings page
Fix payment form validation error
Update dashboard layout for mobile
```

### Pull Requests

1. Update documentation if needed
2. Test your changes thoroughly
3. Ensure all linting passes (`npm run lint`)
4. Create a pull request with a clear description

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components (don't modify directly)
├── hooks/           # Custom React hooks
├── integrations/    # External integrations
├── layouts/         # Page layouts
├── lib/             # Utilities
├── pages/           # Page components
└── types/           # TypeScript types
```

## Testing

Before submitting a PR:

1. Test all affected features manually
2. Check responsive design on mobile
3. Verify dark/light mode works
4. Test authentication flows if affected

## Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Keep PRs focused and reasonably sized
4. Rebase if needed to resolve conflicts

## Getting Help

- Check existing issues for similar problems
- Create a new issue for bugs or feature requests
- Be clear and provide context

## Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Report security issues privately

Thank you for contributing!
