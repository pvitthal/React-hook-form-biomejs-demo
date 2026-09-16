# Biome.js developer demo

## Demo baseline

- Upstream repository: `react-hook-form/react-hook-form` (MIT)
- Recorded clone commit: `287bca28feb39ee9bb021c16672c6c30a17f9fee`
- Package manager: pnpm 12.3.4
- Biome: 2.5.13
- Source scope used by comparison scripts: `src` and `e2e`

The original `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, and upstream scripts remain in place. The `legacy:*` and `biome:*` scripts make the comparison explicit without replacing the original workflow.

## 30-minute flow

1. **Context, 4 min.** Show `package.json`: ESLint, Prettier, their plugins, and Biome coexist in this copy.
2. **Legacy checks, 5 min.** Run `pnpm legacy:lint`, then `pnpm legacy:format:check`. They answer different questions and run as separate processes.
3. **Biome commands, 6 min.** Run `pnpm biome:lint`, `pnpm biome:format:check`, and `pnpm biome:check`. Explain that `check` runs formatting, linting, import organization, and assist actions together.
4. **Predictable live fix, 7 min.** Run the fixture sequence below.
5. **Migration and tradeoffs, 5 min.** Run the read-only migration previews and inspect their summary.
6. **Adoption and debugging, 3 min.** Cover editor, CI, rule parity, and rollback.

## Live fixture sequence

```sh
pnpm demo:reset
pnpm biome:fixture:check
pnpm biome:fixture:write
git diff -- demo-fixtures/working/FormattingAndLintDemo.tsx
pnpm biome:fixture:write:unsafe
pnpm biome:fixture:check
pnpm biome:fixture:syntax
pnpm demo:reset
```

`FormattingAndLintDemo.tsx` starts with formatting differences and two lint diagnostics. The regular `--write` command applies safe formatting fixes but intentionally leaves the button-type error and the unsafe template-literal fix for discussion. `--unsafe` demonstrates the additional opt-in change. `InvalidSyntax.ts` demonstrates Biome's strict parser: an optional chain cannot be the target of an assignment.

## Script reference

| Goal | Legacy | Biome |
| --- | --- | --- |
| Lint only | `pnpm legacy:lint` | `pnpm biome:lint` |
| Format check | `pnpm legacy:format:check` | `pnpm biome:format:check` |
| Apply formatting | `pnpm legacy:format:write` | `pnpm biome:format:write` |
| Combined quality check | `pnpm legacy:check` | `pnpm biome:check` |
| Combined safe writes | legacy lint + format scripts | `pnpm biome:write` |

`biome:write` targets real source files. Use it only after reviewing diagnostics. The fixture scripts provide the safe live auto-fix demonstration.

## Measured formatter check

Measurements were taken once on this Mac against the source scope above after dependencies were installed. They are demonstration data, not a general benchmark.

| Command | Wall time | Result |
| --- | ---: | --- |
| `pnpm legacy:format:check` | 2.988 s | Passed |
| `pnpm biome:format:check` | 0.169 s | Reported formatting differences |

The Biome command completed on the same source scope but exited non-zero because the existing project does not yet match its formatter output. Speed alone is not a migration decision; formatter output, rule coverage, editor support, and CI behavior must also be accepted by the team.

## Safe migration walkthrough

```sh
pnpm exec biome migrate prettier
pnpm exec biome migrate eslint
```

Both commands are read-only until `--write` is supplied. In this repository, the ESLint preview found 476 rules: 54 direct migrations, 11 additional inspired-rule candidates, and 16 nursery-rule candidates. It also reports unsupported plugin rules such as `simple-import-sort/*`, several React rules, and Playwright rules. Treat the generated configuration as a starting point, not a parity guarantee.

Recommended migration order:

1. Commit a clean baseline and keep ESLint plus Prettier active.
2. Run each preview, capture the summary, and use `git diff` before applying any write.
3. Configure formatting first, then choose Biome rules deliberately by domain.
4. Run Biome in advisory CI mode, triage every new diagnostic, and retain ESLint plugins that cover rules Biome does not.
5. Switch required CI checks only after the team accepts the formatter diff and rule-coverage gap.

## Common issues and debugging

| Symptom | What to check | Resolution |
| --- | --- | --- |
| Unexpected formatter diff | Biome defaults and Prettier differences | Align supported options in `biome.json`; document intentional differences rather than forcing byte-for-byte parity. |
| A rule is missing | `biome migrate eslint` summary and rule-source documentation | Keep the ESLint plugin, select an equivalent Biome rule, or accept the coverage gap explicitly. |
| Migration cannot load config | Node resolution, plugin exports, cyclic configuration | Remove suspected entries temporarily, migrate incrementally, then restore and configure manually. |
| Files are skipped | VCS ignores and `biome.json` includes | Use `biome rage --formatter --linter` and inspect configuration resolution. |
| Editor and CLI disagree | Editor extension version and workspace config | Use the project-local Biome package and reload the language server. |
| A parser error blocks formatting | The diagnostic location and syntax | Fix syntax first. Biome avoids formatting malformed code by default. |

Useful commands:

```sh
pnpm exec biome explain useButtonType
pnpm exec biome rage --formatter --linter
pnpm exec biome check --reporter=github
```

## Editor, staged files, and CI

For VS Code, install the official Biome extension, enable format-on-save only after the team agrees that Biome owns formatting, and point the extension at this workspace's local configuration. Do not run Prettier and Biome as competing formatters on save.

For staged files, a team can add `biome check --write` to `lint-staged` for JavaScript and TypeScript paths after the migration decision. Keep a separate type-check command because Biome is not a TypeScript type checker.

For CI, start with `pnpm biome:check` as a non-blocking job. Once accepted, make it required and retain `pnpm type` plus tests. A GitHub Actions job can use pnpm setup, `pnpm install --frozen-lockfile`, and `pnpm biome:check`.

## Sources

- https://biomejs.dev/guides/migrate-eslint-prettier/
- https://biomejs.dev/reference/cli/
- https://biomejs.dev/formatter/differences-with-prettier/
- https://biomejs.dev/guides/configure-biome/
