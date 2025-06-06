# Contributing to Synergis AI

First off, thank you for considering contributing to Synergis AI! It's people like you that make Synergis AI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots and animated GIFs if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript/TypeScript and Python styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Styleguide

* Use TypeScript for all new code
* Use 2 spaces for indentation
* Use camelCase for variables and functions
* Use PascalCase for classes and interfaces
* Use UPPER_CASE for constants
* Add trailing commas
* Use semicolons
* Prefer const over let
* Use arrow functions over function expressions
* Use template literals over string concatenation

```typescript
// Good
const calculateTotal = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

// Bad
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
```

### Python Styleguide

* Follow PEP 8
* Use 4 spaces for indentation
* Use snake_case for variables and functions
* Use PascalCase for classes
* Use UPPER_CASE for constants
* Add docstrings to all public modules, functions, classes, and methods
* Use type hints for function arguments and return values

```python
from typing import List, Optional

class UserService:
    """Service for managing user operations."""

    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        """Retrieve a user by their ID.

        Args:
            user_id: The unique identifier of the user.

        Returns:
            A dictionary containing user information or None if not found.
        """
        return self.db.query("SELECT * FROM users WHERE id = %s", user_id).first()
```

### Documentation Styleguide

* Use Markdown for documentation
* Reference function parameters in backticks
* Use code blocks for examples
* Include links to external resources
* Keep line length to a maximum of 80 characters
* Use headers to organize content
* Include examples for complex features

## Development Process

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Write or update tests
5. Update documentation
6. Run the test suite
7. Create a Pull Request

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/synergis-ai.git
cd synergis-ai

# Create a new branch
git checkout -b feature/your-feature-name

# Install dependencies
# Frontend
cd frontend
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### Running Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
python -m pytest
```

## Additional Notes

### Issue and Pull Request Labels

* `bug`: Something isn't working
* `enhancement`: New feature or request
* `documentation`: Improvements or additions to documentation
* `good first issue`: Good for newcomers
* `help wanted`: Extra attention is needed
* `question`: Further information is requested

## Recognition

Contributors will be recognized in the following ways:

* Addition to the Contributors list in the README
* Mention in release notes when their feature is included
* Special recognition for significant contributions

Thank you for contributing to Synergis AI!