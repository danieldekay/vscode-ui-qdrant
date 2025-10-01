# Tasks: Local DB File Selection

**Input**: Design documents from `/specs/008-local-db-file/`
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
- **VS Code Extension**: `src/`, `tests/` at repository root
- Paths shown below follow VS Code extension structure from plan.md

## Phase 3.1: Setup
- [x] T001 Create VS Code extension source structure per implementation plan
- [x] T002 Verify TypeScript 5.x and VS Code extension dependencies are installed
- [x] T003 [P] Configure linting and formatting tools for TypeScript/VS Code extension

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test for selectLocalDbFile command in tests/contract/select-db-file.contract.test.ts
- [ ] T005 [P] Contract test for FileService.validateQdrantFile in tests/contract/file-service.contract.test.ts
- [ ] T006 [P] Contract test for QdrantService.updateLocalDbPath in tests/contract/qdrant-service.contract.test.ts
- [x] T007 [P] Integration test for file selection workflow in tests/integration/test-file-selection.integration.ts
- [x] T008 [P] Integration test for file validation workflow in tests/integration/test-file-validation.integration.ts
- [x] T009 [P] Integration test for configuration update workflow in tests/integration/test-config-update.integration.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T010 [P] DatabaseFile entity types in src/types/databaseFile.ts
- [x] T011 [P] FileValidationResult entity types in src/types/fileValidation.ts
- [x] T012 [P] QdrantConfig entity types in src/types/qdrantConfig.ts
- [x] T013 [P] Supporting enum and interface types in src/types/common.ts
- [x] T014 [P] FileService.validateQdrantFile implementation in src/services/fileService.ts
- [x] T015 [P] QdrantService.updateLocalDbPath implementation in src/services/qdrantService.ts
- [x] T016 [P] File validation utilities in src/utils/fileValidators.ts
- [x] T017 [P] Error handling utilities in src/utils/errorHandling.ts
- [x] T018 selectLocalDbFile command implementation in src/commands/selectDbFile.ts
- [x] T019 Register selectLocalDbFile command in src/extension.ts

## Phase 3.4: Integration
- [ ] T020 Connect FileService to VS Code workspace.fs API
- [ ] T021 Connect QdrantService to VS Code workspace configuration API
- [ ] T022 Integrate file picker with command handler
- [ ] T023 Connect status bar updates to configuration changes
- [ ] T024 Connect tree view updates to database connections

## Phase 3.5: Polish
- [ ] T025 [P] Unit tests for file validation utilities in tests/unit/test-fileValidators.unit.ts
- [ ] T026 [P] Unit tests for error handling utilities in tests/unit/test-errorHandling.unit.ts
- [ ] T027 [P] Unit tests for type definitions in tests/unit/test-types.unit.ts
- [ ] T028 Performance tests for file validation (<100ms)
- [ ] T029 Performance tests for file selection workflow (<500ms)
- [ ] T030 [P] Update extension documentation in README.md
- [ ] T031 [P] Update API documentation in docs/api.md
- [ ] T032 Remove code duplication and refactor common patterns
- [ ] T033 Run quickstart.md manual testing workflow
- [ ] T034 Final integration test with real Qdrant database file

## Dependencies
- Tests (T004-T009) before implementation (T010-T019)
- T010-T013 blocks T014-T017 (types before services/utilities)
- T014 blocks T018 (FileService before command)
- T015 blocks T018 (QdrantService before command)
- T016-T017 blocks T018 (utilities before command)
- T018 blocks T019 (command implementation before registration)
- Implementation (T010-T019) before integration (T020-T024)
- Integration (T020-T024) before polish (T025-T034)

## Parallel Execution Examples

### Phase 3.2: Contract and Integration Tests
```
# Launch T004-T009 together (all test files are independent):
Task: "Contract test for selectLocalDbFile command in tests/contract/select-db-file.contract.test.ts"
Task: "Contract test for FileService.validateQdrantFile in tests/contract/file-service.contract.test.ts"
Task: "Contract test for QdrantService.updateLocalDbPath in tests/contract/qdrant-service.contract.test.ts"
Task: "Integration test for file selection workflow in tests/integration/test-file-selection.integration.ts"
Task: "Integration test for file validation workflow in tests/integration/test-file-validation.integration.ts"
Task: "Integration test for configuration update workflow in tests/integration/test-config-update.integration.ts"
```

### Phase 3.3: Type Definitions
```
# Launch T010-T013 together (all type files are independent):
Task: "DatabaseFile entity types in src/types/databaseFile.ts"
Task: "FileValidationResult entity types in src/types/fileValidation.ts"
Task: "QdrantConfig entity types in src/types/qdrantConfig.ts"
Task: "Supporting enum and interface types in src/types/common.ts"
```

### Phase 3.3: Services and Utilities
```
# Launch T014-T017 together (services/utilities are independent):
Task: "FileService.validateQdrantFile implementation in src/services/fileService.ts"
Task: "QdrantService.updateLocalDbPath implementation in src/services/qdrantService.ts"
Task: "File validation utilities in src/utils/fileValidators.ts"
Task: "Error handling utilities in src/utils/errorHandling.ts"
```

### Phase 3.5: Unit Tests and Documentation
```
# Launch T025-T027 together (unit test files are independent):
Task: "Unit tests for file validation utilities in tests/unit/test-fileValidators.unit.ts"
Task: "Unit tests for error handling utilities in tests/unit/test-errorHandling.unit.ts"
Task: "Unit tests for type definitions in tests/unit/test-types.unit.ts"

# Launch T030-T031 together (documentation files are independent):
Task: "Update extension documentation in README.md"
Task: "Update API documentation in docs/api.md"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (run `npm test` after T004-T009)
- Commit after each task completion
- Avoid: vague tasks, same file conflicts
- VS Code extension requires proper activation and command registration
- File operations must handle VS Code's URI system correctly
- Error handling should integrate with VS Code's notification system

## Task Generation Rules Applied
*Applied during main() execution*

1. **From Contracts** (3 files):
   - select-db-file.contract.md → T004 contract test [P]
   - file-validation.contract.md → T005 contract test [P]
   - config-update.contract.md → T006 contract test [P]

2. **From Data Model** (3 entities):
   - DatabaseFile entity → T010 model task [P]
   - FileValidationResult entity → T011 model task [P]
   - QdrantConfig entity → T012 model task [P]
   - Supporting types → T013 model task [P]

3. **From User Stories** (3 acceptance scenarios):
   - File selection workflow → T007 integration test [P]
   - File validation workflow → T008 integration test [P]
   - Configuration update workflow → T009 integration test [P]

4. **From Quickstart** (1 workflow):
   - Manual testing workflow → T033 validation task

5. **Ordering**:
   - Setup (T001-T003) → Tests (T004-T009) → Types (T010-T013) → Services/Utilities (T014-T017) → Command (T018) → Registration (T019) → Integration (T020-T024) → Polish (T025-T034)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (3/3)
- [x] All entities have model tasks (3/3 + supporting types)
- [x] All tests come before implementation (T004-T009 before T010-T019)
- [x] Parallel tasks are truly independent (different file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Dependencies properly ordered (types → services → commands → integration → polish)
- [x] VS Code extension structure followed from plan.md</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/008-local-db-file/tasks.md