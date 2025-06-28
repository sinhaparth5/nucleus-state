
# Contributing to Nucleus State

Thank you for considering contributing to Nucleus State! 🎉 We're excited to have you as part of our community. This guide will help you get started with contributing to the project.

## 🌟 Ways to Contribute

There are many ways you can contribute to Nucleus State:

- 🐛 **Report bugs** - Help us identify and fix issues
- 💡 **Suggest features** - Share ideas for new functionality
- 📖 **Improve documentation** - Make our docs clearer and more helpful
- 🧪 **Write tests** - Increase test coverage and reliability
- 💻 **Submit code changes** - Fix bugs or implement new features
- 🎨 **Improve examples** - Add or enhance usage examples
- 🗣️ **Help others** - Answer questions in issues and discussions

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Setting Up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nucleus-state.git
   cd nucleus-state
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Scripts

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Run all checks (tests, types, lint)
npm run validate
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Create an atom with '...'
2. Use it in component '....'
3. Call function '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Code Example**
```tsx
// Minimal reproducible example
const problemAtom = createAtom(initialValue);
// ... rest of the code that demonstrates the issue
```

**Environment:**
- Nucleus State version: [e.g., 1.0.0]
- React version: [e.g., 18.2.0]
- TypeScript version: [e.g., 4.9.0]
- Browser: [e.g., Chrome 110]
- OS: [e.g., macOS 13.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing issues** to avoid duplicates
2. **Use the feature request template**
3. **Provide clear use cases** and examples
4. **Explain the problem** the feature would solve

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Use Cases**
Specific examples of how this feature would be used:
- Use case 1: ...
- Use case 2: ...

**Code Example**
```tsx
// How you envision the API would work
const myAtom = createAtom(value, { newFeature: true });
```

**Additional context**
Any other context, screenshots, or examples.
```

## 💻 Code Contributions

### Code Style and Standards

We use the following tools to maintain code quality:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **Conventional Commits** for commit messages

### Commit Message Format

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```
feat: add persistence option to createAtom
fix: resolve memory leak in atom cleanup
docs: update README with new examples
test: add tests for computed atoms
```

### Pull Request Process

1. **Ensure your code follows our standards**:
   ```bash
   npm run validate
   ```

2. **Write or update tests** for your changes
3. **Update documentation** if needed
4. **Create a pull request** with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots if applicable

### Pull Request Template

When creating a pull request, please use this template:

```markdown
## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Fixes #(issue number)

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

## 🧪 Testing Guidelines

### Writing Tests

- **Test file naming**: `*.test.ts` or `*.test.tsx`
- **Test location**: Same directory as the source file or in `__tests__` folder
- **Test coverage**: Aim for high coverage, especially for new features

### Test Structure

```tsx
import { createAtom, useAtom } from '../src';
import { renderHook, act } from '@testing-library/react';

describe('createAtom', () => {
  it('should create atom with initial value', () => {
    const atom = createAtom(42);
    const { result } = renderHook(() => useAtom(atom));
    
    expect(result.current[0]).toBe(42);
  });

  it('should update atom value', () => {
    const atom = createAtom(0);
    const { result } = renderHook(() => useAtom(atom));

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
  });
});
```

## 📖 Documentation Guidelines

### Documentation Standards

- **Clear and concise** explanations
- **Working code examples** for all features
- **TypeScript examples** when relevant
- **Real-world use cases**

### Types of Documentation

1. **API Documentation**: Function signatures and parameters
2. **Usage Examples**: How to use features in practice
3. **Guides**: Step-by-step tutorials
4. **README**: Project overview and quick start

## 🎨 Example Contributions

### Adding New Examples

When adding examples:

1. **Keep them simple** and focused
2. **Use real-world scenarios**
3. **Include TypeScript types**
4. **Test that they work**

Example structure:
```tsx
// examples/modal-management.tsx
import { createAtom, useAtom } from 'nucleus-state';

const modalAtom = createAtom(false);

export function ModalExample() {
  // Implementation here
}
```

## 🤝 Community Guidelines

### Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### Communication

- **Be respectful** and constructive in all interactions
- **Help others** learn and grow
- **Ask questions** if you're unsure about something
- **Share knowledge** and experiences

### Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Ask in GitHub Discussions** for general questions
4. **Create an issue** for specific bugs or feature requests

## 🏆 Recognition

Contributors are recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** section

## 📞 Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: [sinhaparth555@gmail.com] for private matters

## 🎯 Good First Issues

Looking for a place to start? Check out issues labeled:

- `good first issue` - Perfect for newcomers
- `help wanted` - We'd love help with these
- `documentation` - Great for non-code contributions

## 📝 License

By contributing to Nucleus State, you agree that your contributions will be licensed under the BSD-2-Clause License.

---

**Thank you for contributing to Nucleus State! Every contribution, no matter how small, helps make the project better for everyone.** 🚀
