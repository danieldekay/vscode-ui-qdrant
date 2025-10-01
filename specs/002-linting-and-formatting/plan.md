# Implementation Plan: Linting and Formatting

**Branch**: `002-linting-and-formatting` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-linting-and-formatting/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Establish automated code quality and formatting system for the VSCode UI Qdrant extension with automatic linting and formatting on file save. The system will enforce TypeScript code quality standards, maintain consistent code style across the codebase, and integrate seamlessly with VS Code's development workflow. Performance targets include <100ms formatting and <500ms linting feedback to ensure a smooth developer experience.

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable) with Node.js LTS 20.x+ runtime
**Primary Dependencies**: Linting/formatting tool (Biome OR ESLint + Prettier), VS Code extension API, existing TypeScript compiler integration
**Storage**: Configuration files (committed to version control), VS Code workspace settings
**Testing**: TypeScript compiler type checking, automated linting validation, formatting consistency tests
**Target Platform**: VS Code Extension Host environment (Node.js based)
**Project Type**: single - VS Code extension with unified source structure
**Performance Goals**: <100ms formatting for files <1,000 lines, <500ms linting feedback, non-blocking editor operations
**Constraints**: Must integrate with existing TypeScript 5.x configuration, constitutional requirement for modern tools (2025-current), zero additional developer setup after npm install
**Scale/Scope**: Single project affecting all TypeScript files in extension codebase, automated workflow for all developers

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Extension-First Architecture**:

- [x] All features designed as VS Code extension components
- [x] No bypassing of VS Code extension API boundaries
- [x] Respects VS Code extension security model

**Qdrant API Integrity**:

- [N/A] Uses only official Qdrant REST API or gRPC interfaces
- [N/A] No direct database file manipulation
- [N/A] Graceful handling of connection failures
- [N/A] Preserves Qdrant data integrity

**Test-First Development**:

- [x] TDD approach planned for all user-facing features
- [N/A] Integration tests planned for Qdrant API interactions
- [N/A] Mock Qdrant instances for testing (no external dependencies)

**Progressive Enhancement UI**:

- [x] Features work without blocking VS Code core functionality
- [N/A] Graceful degradation on Qdrant connection failures
- [N/A] Confirmation dialogs for critical operations
- [x] Loading states for operations >200ms

**Developer Experience First**:

- [x] Reduces cognitive load for vector database operations
- [x] Uses intuitive VS Code UI metaphors
- [x] Provides immediate feedback and clear next steps
- [x] Actionable error messages with remediation steps

**Technology Stack Requirements**:

- [x] TypeScript 5.x with strict mode enabled
- [x] Node.js LTS (20.x or higher) for runtime
- [x] npm or pnpm used consistently
- [x] Dependencies locked to specific versions

**Code Quality Standards**:

- [x] All code passes TypeScript type checking (tsc --noEmit)
- [x] All code passes linting checks
- [x] Consistent formatting with automated tools
- [x] No unused variables or imports
- [x] Strict TypeScript compiler options enabled

**Tooling Philosophy**:

- [x] Modern, actively-maintained tools (2025-current)
- [x] Single-purpose tools preferred
- [x] All dev tools lockable to specific versions
- [x] CI validates all quality checks
- [x] Tool configurations committed to version control

**File Structure Requirements**:

- [x] Source code organized in src/ directory
- [x] Build output in dist/ (gitignored)
- [x] Configuration files at project root
- [x] All configs committed to version control

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── linting/
│   ├── rules/
│   └── config/
├── formatting/
│   └── config/
└── index.ts

tests/
├── contract/
│   ├── linting-validation.test.ts
│   └── formatting-validation.test.ts
├── integration/
│   ├── auto-save-linting.test.ts
│   ├── auto-save-formatting.test.ts
│   └── build-validation.test.ts
└── unit/
    ├── linting-config.test.ts
    └── formatting-config.test.ts

.vscode/
├── settings.json (updated with linting/formatting settings)
└── extensions.json (recommended extensions)

# Configuration files at root
biome.json OR .eslintrc.json + .prettierrc
package.json (updated with linting/formatting scripts and dependencies)
```

**Structure Decision**: Single project structure (Option 1) is used as this is a VS Code extension. Linting and formatting configuration will be added to the existing TypeScript project established in feature 001-typescript-configuration. New directories created only for organizing linting/formatting logic if needed, otherwise configuration files at root suffice.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:

   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:

   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:

   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:

   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:

   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (data-model.md, contracts/, quickstart.md)
- Biome configuration validation contract → contract test task [P]
- Auto-format on save validation → integration test task [P]
- Linting validation contract → integration test task [P]
- Performance validation → integration test task [P]
- Build integration validation → integration test task [P]
- Configuration entities (biome.json, VS Code settings) → configuration file creation tasks [P]
- Quickstart scenarios → validation integration tests
- Implementation tasks: Biome setup, VS Code integration, build script updates, documentation

**Ordering Strategy**:

- TDD order: Configuration validation tests before configuration file creation
- Dependency order: Biome installation → Configuration → VS Code integration → Build integration
- Mark [P] for parallel execution (independent configuration files and test suites)
- Performance and build validation tests run after core configuration established

**Estimated Output**: 18-22 numbered, ordered tasks focused on Biome setup and VS Code integration

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---

_Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`_
