# Commit message format

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification,
for adding human and machine readable meaning to commit messages.

Each message start with a type, which _can_ be one of the following:

  - `feat:` - we are adding a new feature
  - `fix:` - we are fixing a bug
  - `docs:` - we are adding/updating documentation
  - `test:` - we are adding/updating tests
  - `ci:` - we are adding/updating CI configuration
  - `chore:` - we are changing other files other than sources/tests.
  - `refactor:` - we are neither fixing a bug nor adding a feature, but rather refactoring code (which also includes removing code)

There are other [types](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type), but not widely used.

## Examples

Example of a simple commit message, when adding a new feature:

```
feat: add new compiler
```

or perhaps when fixing some bug:

```
fix: stack overflow error in compiler
```

To spark up a commit message, you can include icons in your commit message:

```
fix: :bug: stack overflow error in compiler
```

which will be rendered as:

```
fix: 🐛 stack overflow error in compiler
```

## Advanced examples

Commit messages can be more complex, you can specify scope of the change, and also breaking changes if needed:

```
feat(compiler): ✨ add new compiler option

Here, you can write a longer description of the commit.
The message can span multiple lines.

BREAKING CHANGE: This commit changes the behavior of the compiler.
```

## IDE Extensions

  - [conventional-commits for VSCode](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)
  - [conventional-commit for Rider](https://plugins.jetbrains.com/plugin/13389-conventional-commit)
