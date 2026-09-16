# Biome.js Developer Demo Report

This folder explains the Biome.js demonstration project. The working copy is based on the public React Hook Form repository and keeps its existing ESLint and Prettier setup intact so the tools can be compared side by side.

## What is Biome?

Biome is a fast developer toolchain for JavaScript and TypeScript projects. It provides a formatter, linter, import organization, code-assist actions, and an editor language server through one project configuration: `biome.json`.

Biome can simplify a quality workflow, but it is not automatically a complete replacement for every ESLint plugin or for TypeScript type checking. A safe migration confirms formatter output, lint-rule coverage, editor behavior, and CI behavior before making it mandatory.

## This demo project

- **Upstream:** `react-hook-form/react-hook-form` (MIT)
- **Recorded commit:** `287bca28feb39ee9bb021c16672c6c30a17f9fee`
- **Biome version:** `2.5.13`
- **Configuration:** [`../biome.json`](../biome.json)
- **Detailed runbook:** [`../docs/BIOMEJS_DEMO_RUNBOOK.md`](../docs/BIOMEJS_DEMO_RUNBOOK.md)
- **Slide deck:** [`../presentation/Biomejs-Developer-Demo.pptx`](../presentation/Biomejs-Developer-Demo.pptx)

## Setup

```sh
pnpm install --frozen-lockfile
pnpm exec biome --version
```

## Commands and scripts

### Existing upstream commands

| Command | Purpose |
| --- | --- |
| `pnpm lint` | Original ESLint command for the project. |
| `pnpm lint:fix` | Original ESLint command with automatic fixes. |
| `pnpm prettier:fix` | Original Prettier write command. |
| `pnpm type` | TypeScript type check. |
| `pnpm test` | Jest test suite. |
| `pnpm build` | Production build. |

### Side-by-side comparison commands

| Command | Purpose |
| --- | --- |
| `pnpm legacy:lint` | Run ESLint only on the demo source scope. |
| `pnpm legacy:lint:fix` | Run ESLint fixes on the demo source scope. |
| `pnpm legacy:format:check` | Check formatting with Prettier. |
| `pnpm legacy:format:write` | Apply Prettier formatting. |
| `pnpm legacy:check` | Run the legacy lint and format checks together. |
| `pnpm biome:lint` | Run Biome lint only. |
| `pnpm biome:format:check` | Check formatting with Biome. |
| `pnpm biome:format:write` | Apply Biome formatting. |
| `pnpm biome:check` | Run Biome's combined check on the demo source scope. |
| `pnpm biome:write` | Apply Biome safe writes on the demo source scope. Review the diff before committing. |

`biome:check` combines formatter, linter, import organization, and assist actions where applicable. `pnpm type` remains necessary because Biome does not replace TypeScript's type checker.

## Repeatable live demo

The disposable fixtures under `demo-fixtures/working` give predictable diagnostics without modifying React Hook Form source code.

```sh
pnpm demo:reset
pnpm biome:fixture:check
pnpm biome:fixture:write
git diff -- demo-fixtures/working/FormattingAndLintDemo.tsx
pnpm biome:fixture:write:unsafe
pnpm biome:fixture:syntax
pnpm demo:reset
```

The normal `--write` command applies safe formatting changes. The fixture deliberately retains an accessibility error and an unsafe template-literal suggestion, which makes the safety boundary visible during the presentation. The syntax fixture shows that Biome reports invalid TypeScript rather than formatting malformed code.

## Migration workflow

Start with read-only previews:

```sh
pnpm exec biome migrate prettier
pnpm exec biome migrate eslint
```

Only use `--write` after reviewing the result with `git diff`. The current project preview finds direct migrations and reports coverage gaps, including plugin rules that must remain in ESLint or be consciously retired. Do not assume byte-for-byte Prettier output or full ESLint parity.

## Debugging

```sh
pnpm exec biome explain useButtonType
pnpm exec biome rage --formatter --linter
pnpm exec biome check --reporter=github
```

Use `biome rage` when the editor, CLI, configuration, ignores, or enabled rules do not behave as expected.

## Presentation materials

- [`../presentation/Biomejs-Developer-Demo.pptx`](../presentation/Biomejs-Developer-Demo.pptx)
- [`../presentation/Biomejs-Developer-Demo.pdf`](../presentation/Biomejs-Developer-Demo.pdf)
- [`../docs/BIOMEJS_CI_EXAMPLE.yml`](../docs/BIOMEJS_CI_EXAMPLE.yml)

## Official references

- https://biomejs.dev/guides/migrate-eslint-prettier/
- https://biomejs.dev/reference/cli/
- https://biomejs.dev/guides/configure-biome/
- https://biomejs.dev/formatter/differences-with-prettier/
