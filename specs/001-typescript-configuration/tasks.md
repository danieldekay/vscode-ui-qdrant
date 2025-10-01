# Tasks: TypeScript Configuration

**Input**: Design documents from `/specs/001-typescript-configuration/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✓ COMPLETE: Implementation plan found
   → Extract: TypeScript 5.x, Node.js LTS 20.x+, VS Code extension
2. Load optional design documents:
   → data-model.md: Extract entities → configuration model tasks
   → contracts/: TypeScript config validation → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, TypeScript dependencies, linting
   → Tests: configuration validation tests, compilation tests
   → Core: tsconfig.json, package.json setup, directory structure
   → Integration: TypeScript compiler integration, VS Code integration
   → Polish: validation scripts, documentation, quickstart verification
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → Configuration validation contract has tests? ✓
   → TypeScript Configuration entity has implementation? ✓
   → Quickstart scenarios covered? ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `dist/`, configuration files at root
- Paths shown below assume VS Code extension project structure

## Phase 3.1: Setup

- [ ] T001 Create project directory structure (src/, dist/, .gitignore)
- [ ] T002 Initialize package.json with TypeScript 5.x dependencies
- [ ] T003 [P] Configure .gitignore to exclude dist/ and node_modules/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T004 [P] Configuration validation test in tests/config/test_tsconfig_validation.ts
- [ ] T005 [P] Compilation output test in tests/integration/test_compilation_output.ts
- [ ] T006 [P] Type checking validation test in tests/integration/test_type_checking.ts
- [ ] T007 [P] Source map generation test in tests/integration/test_source_maps.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T008 [P] Create tsconfig.json with required compiler options at project root
- [ ] T009 [P] Create package.json TypeScript configuration and scripts
- [ ] T010 [P] Create src/index.ts as initial TypeScript entry point
- [ ] T011 TypeScript compiler integration and build script setup
- [ ] T012 Validation script for tsconfig.json compliance
- [ ] T013 VS Code workspace settings for TypeScript integration

## Phase 3.4: Integration

- [ ] T014 Configure TypeScript compilation pipeline
- [ ] T015 Set up automated type checking in build process
- [ ] T016 Integrate source map generation with debugging workflow
- [ ] T017 Configure VS Code extension development settings

## Phase 3.5: Polish

- [ ] T018 [P] Unit tests for configuration validation in tests/unit/test_config_validation.ts
- [ ] T019 [P] Performance validation (<200ms compilation feedback)
- [ ] T020 [P] Update documentation with TypeScript setup guide
- [ ] T021 Verify quickstart.md instructions work end-to-end
- [ ] T022 Run comprehensive configuration validation

## Dependencies

- Setup (T001-T003) before tests (T004-T007)
- Tests (T004-T007) before implementation (T008-T013)
- T008 blocks T011, T014
- T009 blocks T014, T015
- Implementation before integration (T014-T017)
- Integration before polish (T018-T022)

## Parallel Example

```
# Launch T004-T007 together:
Task: "Configuration validation test in tests/config/test_tsconfig_validation.ts"
Task: "Compilation output test in tests/integration/test_compilation_output.ts"
Task: "Type checking validation test in tests/integration/test_type_checking.ts"
Task: "Source map generation test in tests/integration/test_source_maps.ts"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing configuration
- Commit after each task completion
- Ensure all constitutional requirements are met

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:

   - typescript-config-validation.md → T004 contract test task [P]
   - Compilation output validation → T005 integration test [P]

2. **From Data Model**:

   - TypeScript Configuration Entity → T008 tsconfig.json creation [P]
   - Compiler Options Entity → T009 package.json setup [P]
   - Build Output Entity → T014 compilation pipeline setup

3. **From Quickstart Scenarios**:

   - Configuration creation → T008 implementation
   - Installation steps → T002 dependency setup
   - Validation steps → T021 end-to-end verification

4. **Ordering**:
   - Setup → Tests → Configuration → Integration → Polish
   - Dependencies block parallel execution where files overlap

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] Configuration validation contract has corresponding test (T004)
- [x] TypeScript Configuration entity has implementation task (T008)
- [x] All test tasks come before implementation (T004-T007 before T008-T013)
- [x] Parallel tasks are truly independent ([P] tasks use different files)
- [x] Each task specifies exact file path and purpose
- [x] No task modifies same file as another [P] task
- [x] Constitutional requirements covered (strict mode, ES2022+, source maps)
