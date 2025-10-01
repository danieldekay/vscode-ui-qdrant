# Tasks: Linting and Formatting

**Input**: Design documents from `/specs/002-linting-and-formatting/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✓ COMPLETE: Implementation plan found
   → Extract: TypeScript 5.x, Node.js LTS 20.x+, Biome for linting/formatting
2. Load optional design documents:
   → data-model.md: Extract entities → configuration tasks
   → contracts/: biome-validation.md → contract test tasks
   → research.md: Biome selection decision → setup tasks
3. Generate tasks by category:
   → Setup: Biome installation, configuration files
   → Tests: configuration validation, auto-format tests, linting tests
   → Core: biome.json, VS Code settings, build scripts
   → Integration: VS Code extension, build process
   → Polish: performance validation, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → Biome configuration validation contract has tests? ✓
   → Auto-format on save validation has tests? ✓
   → VS Code integration validated? ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/`, configuration files at root
- Paths shown below assume VS Code extension project structure

## Phase 3.1: Setup
- [x] T001 Install Biome as dev dependency with exact version lock
- [x] T002 [P] Create .vscode/extensions.json with Biome recommendation
- [x] T003 [P] Update .gitignore to exclude Biome cache files

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Biome configuration validation test in tests/config/test_biome_config.ts
- [x] T005 [P] Auto-format on save test in tests/integration/test_auto_format.ts
- [x] T006 [P] Linting validation test in tests/integration/test_linting.ts
- [x] T007 [P] Performance validation test in tests/integration/test_performance.ts
- [x] T008 [P] Build integration test in tests/integration/test_build_integration.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T009 [P] Create biome.json with formatter and linter configuration at project root
- [x] T010 [P] Update .vscode/settings.json with Biome auto-format on save settings
- [x] T011 [P] Update package.json with Biome scripts (lint, lint:fix, format, format:fix)
- [x] T012 Update pretest script to include Biome linting validation
- [x] T013 Create validation script for Biome configuration compliance in scripts/validate-biome.js
- [x] T014 [P] Create performance validation script in scripts/validate-biome-performance.js

## Phase 3.4: Integration
- [x] T015 Configure Biome VS Code extension integration
- [x] T016 Update build process to enforce linting before compilation
- [x] T017 Add Biome CI validation command for automated pipelines
- [x] T018 Test end-to-end auto-format workflow

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for Biome config validation in tests/unit/test_biome_validation.ts
- [ ] T020 [P] Performance validation (<100ms format, <500ms lint)
- [ ] T021 [P] Update README.md with linting and formatting setup guide
- [ ] T022 Verify quickstart.md instructions work end-to-end
- [ ] T023 Run comprehensive Biome validation

## Dependencies
- Setup (T001-T003) before tests (T004-T008)
- Tests (T004-T008) before implementation (T009-T014)
- T009 blocks T012, T016
- T010 blocks T015, T018
- T011 blocks T016, T017
- Implementation before integration (T015-T018)
- Integration before polish (T019-T023)

## Parallel Example
```
# Launch T004-T008 together:
Task: "Biome configuration validation test in tests/config/test_biome_config.ts"
Task: "Auto-format on save test in tests/integration/test_auto_format.ts"
Task: "Linting validation test in tests/integration/test_linting.ts"
Task: "Performance validation test in tests/integration/test_performance.ts"
Task: "Build integration test in tests/integration/test_build_integration.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing configuration
- Commit after each task completion
- Ensure all constitutional requirements are met
- Biome replaces ESLint + Prettier for simplicity and performance

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - biome-validation.md → T004 config validation test [P]
   - Auto-format on save contract → T005 integration test [P]
   - Linting validation contract → T006 integration test [P]
   - Performance contract → T007 integration test [P]
   - Build integration contract → T008 integration test [P]

2. **From Data Model**:
   - Biome Configuration Entity → T009 biome.json creation [P]
   - VS Code Workspace Settings Entity → T010 settings.json update [P]
   - Build Script Configuration Entity → T011 package.json scripts [P]

3. **From Quickstart Scenarios**:
   - Biome installation → T001 dependency installation
   - Configuration setup → T009, T010 file creation
   - Validation steps → T022 end-to-end verification

4. **Ordering**:
   - Setup → Tests → Configuration → Integration → Polish
   - Dependencies block parallel execution where files overlap

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] Biome configuration validation contract has corresponding test (T004)
- [x] Auto-format on save validation has test (T005)
- [x] All test tasks come before implementation (T004-T008 before T009-T014)
- [x] Parallel tasks are truly independent ([P] tasks use different files)
- [x] Each task specifies exact file path and purpose
- [x] No task modifies same file as another [P] task
- [x] Constitutional requirements covered (modern tools, performance, zero setup)
