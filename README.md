# vibe-check

The Grammarly for AI Code. Catch AI slop before it ships.

```
   ╭───────── vibe-check ─────────╮
   │                              │
   │   Vibe Score: 100/100        │
   │   Status: Immaculate Vibes   │
   │                              │
   ╰──────────────────────────────╯
```

## What it does

`vibe-check` is a specialized linter that catches patterns AI coding assistants love to leave behind:

- **`any` types** - The TypeScript cop-out
- **Lazy comments** - `// TODO`, `// fix later`, `// idk`
- **Generic names** - `data`, `handleStuff`, `processItem`
- **Large files** - 500+ line monsters
- **Console spam** - `console.log` left in production code
- **Empty catch blocks** - Swallowed errors

It doesn't replace ESLint—it catches the *vibe* problems ESLint misses.

## Install

```bash
npm install -g vibe-check
```

Or run directly:

```bash
npx vibe-check .
```

## Usage

```bash
# Check current directory
vibe-check .

# Check specific folder
vibe-check src

# Strict mode (fail on any violation)
vibe-check --strict

# Custom threshold (default: 70)
vibe-check --threshold=90
```

## GitHub Action

Add to your workflow:

```yaml
name: Vibe Check
on: [push, pull_request]

jobs:
  vibe-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hereshecodes/vibe-check@v1
        with:
          path: src
          threshold: 70
```

## Scoring

Your codebase gets a **Vibe Score** from 0-100:

| Score | Status |
|-------|--------|
| 90-100 | Immaculate Vibes |
| 70-89 | Good Vibes |
| 50-69 | Mid Vibes |
| 30-49 | Bad Vibes |
| 0-29 | AI Slop Detected |

The default passing threshold is 70. Use `--strict` for zero tolerance.

## Rules

### no-any
Flags usage of the `any` type. If you're using TypeScript, use it properly.

```typescript
// Bad
const data: any = fetchUser();

// Good
const user: User = fetchUser();
```

### no-lazy-comments
Flags TODO, FIXME, and other procrastination markers.

```typescript
// Bad
// TODO: fix this later
// idk why this works

// Good
// Handles edge case where user has no email (see issue #123)
```

### no-generic-names
Flags variable and function names that say nothing.

```typescript
// Bad
const data = getData();
function handleStuff(item) {}

// Good
const userProfile = fetchUserProfile();
function validatePaymentMethod(paymentMethod) {}
```

### no-large-files
Flags files over 500 lines. Break them up.

### no-console
Flags `console.log` statements. Use a proper logger.

### no-empty-catch
Flags empty catch blocks that swallow errors silently.

## License

MIT

## Support

Like vibe-check? Support development at [vibe-check-lilac-five.vercel.app](https://vibe-check-lilac-five.vercel.app)
