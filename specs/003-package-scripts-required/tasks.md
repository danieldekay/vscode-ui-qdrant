# Tasks: Package Scripts Required

**Input**: Design documents from `/specs/003-package-scripts-required/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [x] T001 Install tsx dependency for development server
- [x] T002 [P] Verify Biome configuration in biome.json
- [x] T003 [P] Verify TypeScript configuration in tsconfig.json

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test for validate-scripts API in tests/contract/test_validate_scripts.js
- [x] T005 [P] Contract test for execute-script API in tests/contract/test_execute_script.js
- [x] T006 [P] Integration test for script presence validation in tests/integration/test_script_presence.js
- [x] T007 [P] Integration test for typecheck script execution in tests/integration/test_typecheck_script.js
- [x] T008 [P] Integration test for lint script execution in tests/integration/test_lint_script.js
- [x] T009 [P] Integration test for format script execution in tests/integration/test_format_script.js
- [x] T010 [P] Integration test for check script execution in tests/integration/test_check_script.js
- [x] T011 [P] Integration test for build script execution in tests/integration/test_build_script.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T012 Add typecheck script to package.json
- [x] T013 Add lint script to package.json
- [x] T014 Add format script to package.json
- [x] T015 Add dev script to package.json
- [x] T016 Add build script to package.json
- [x] T017 Add check script to package.json
- [x] T018 Test all scripts execute successfully

## Phase 3.4: Integration
- [ ] T019 Update README.md with script usage instructions
- [ ] T020 Verify scripts work in CI/CD environment
- [ ] T021 Test script execution from different directories

## Phase 3.5: Polish
- [ ] T022 [P] Add script validation to pre-commit hooks
- [ ] T023 Performance test script execution times
- [ ] T024 [P] Update .github/copilot-instructions.md with script information
- [ ] T025 Run quickstart.md validation
- [ ] T026 Document alternative tool configurations

## Dependencies
- Tests (T004-T011) before implementation (T012-T018)
- T012-T017 can run in parallel (different script properties in same file)
- T018 blocks T019-T021
- Implementation before polish (T022-T026)

## Parallel Example
```
# Launch T004-T011 together:
Task: "Contract test for validate-scripts API in tests/contract/test_validate_scripts.js"
Task: "Contract test for execute-script API in tests/contract/test_execute_script.js"
Task: "Integration test for script presence validation in tests/integration/test_script_presence.js"
Task: "Integration test for typecheck script execution in tests/integration/test_typecheck_script.js"
Task: "Integration test for lint script execution in tests/integration/test_lint_script.js"
Task: "Integration test for format script execution in tests/integration/test_format_script.js"
Task: "Integration test for check script execution in tests/integration/test_check_script.js"
Task: "Integration test for build script execution in tests/integration/test_build_script.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/003-package-scripts-required/tasks.md