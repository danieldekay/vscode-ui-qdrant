# Tasks: VSCode Extension Scaffold & Development Environment

**Input**: Design documents from `/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/005-vscode-extension-scaffold/`
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
- Paths shown below assume single VS Code extension project - adjust based on plan.md structure

## Phase 3.1: Setup
- [x] T001 Create VS Code extension project structure per implementation plan
- [x] T002 Initialize TypeScript 5.x project with VS Code Extension API dependencies
- [x] T003 [P] Configure linting and formatting tools (Biome)
- [x] T004 [P] Set up TypeScript configuration for extension development
- [x] T005 [P] Configure npm scripts (typecheck, lint, format, build, dev, check)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test for extension activation in tests/contract/test-extension-activation.ts
- [ ] T007 [P] Contract test for Qdrant connection in tests/contract/test-qdrant-connection.ts
- [ ] T008 [P] Contract test for vector search in tests/contract/test-vector-search.ts
- [ ] T009 [P] Contract test for collection management in tests/contract/test-collection-management.ts
- [ ] T010 [P] Integration test for extension project setup in tests/integration/test-project-setup.ts
- [ ] T011 [P] Integration test for extension activation in tests/integration/test-extension-activation.ts
- [ ] T012 [P] Integration test for basic UI components in tests/integration/test-ui-components.ts
- [ ] T013 [P] Integration test for code quality tools in tests/integration/test-code-quality.ts
- [ ] T014 [P] Integration test for connection failure handling in tests/integration/test-connection-failure.ts
- [ ] T015 [P] Integration test for version compatibility in tests/integration/test-version-compatibility.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T016 [P] Extension Manifest entity in src/models/extension-manifest.ts
- [ ] T017 [P] Qdrant Connection entity in src/models/qdrant-connection.ts
- [ ] T018 [P] Vector Search Query entity in src/models/vector-search-query.ts
- [ ] T019 [P] Search Result entity in src/models/search-result.ts
- [ ] T020 [P] Collection Info entity in src/models/collection-info.ts
- [ ] T021 [P] UI State entity in src/models/ui-state.ts
- [ ] T022 Qdrant client service in src/qdrant/client.ts
- [ ] T023 Vector search service in src/qdrant/search.ts
- [ ] T024 Collection management service in src/qdrant/collections.ts
- [ ] T025 Main extension entry point in src/extension.ts
- [ ] T026 Status bar UI component in src/ui/statusBar.ts
- [ ] T027 Search view UI component in src/ui/searchView.ts
- [ ] T028 Collection view UI component in src/ui/collectionView.ts
- [ ] T029 Test runner configuration in src/test/runTest.ts
- [ ] T030 Qdrant mock for testing in src/test/qdrantMock.ts

## Phase 3.4: Integration
- [ ] T031 Connect extension to VS Code activation events
- [ ] T032 Register commands in VS Code command palette
- [ ] T033 Initialize tree data providers for collections
- [ ] T034 Set up webview panels for search results
- [ ] T035 Configure extension settings and configuration
- [ ] T036 Implement error handling and logging

## Phase 3.5: Polish
- [ ] T037 [P] Unit tests for validation logic in tests/unit/test-validation.ts
- [ ] T038 [P] Unit tests for UI components in tests/unit/test-ui-components.ts
- [ ] T039 Performance tests for search operations (<2 seconds)
- [ ] T040 [P] Update README.md with extension documentation
- [ ] T041 [P] Create extension packaging configuration
- [ ] T042 Remove code duplication and refactor
- [ ] T043 Run quickstart validation scenarios
- [ ] T044 Final integration testing with local Qdrant instance

## Dependencies
- Setup tasks (T001-T005) before all other tasks
- Tests (T006-T015) before implementation (T016-T036)
- Model entities (T016-T021) before services (T022-T024)
- Services (T022-T024) before main extension (T025)
- Main extension (T025) before UI components (T026-T028)
- UI components (T026-T028) before integration (T031-T036)
- Implementation (T016-T036) before polish (T037-T044)

## Parallel Example
```
# Launch T006-T009 together (contract tests):
Task: "Contract test for extension activation in tests/contract/test-extension-activation.ts"
Task: "Contract test for Qdrant connection in tests/contract/test-qdrant-connection.ts"
Task: "Contract test for vector search in tests/contract/test-vector-search.ts"
Task: "Contract test for collection management in tests/contract/test-collection-management.ts"

# Launch T016-T021 together (model entities):
Task: "Extension Manifest entity in src/models/extension-manifest.ts"
Task: "Qdrant Connection entity in src/models/qdrant-connection.ts"
Task: "Vector Search Query entity in src/models/vector-search-query.ts"
Task: "Search Result entity in src/models/search-result.ts"
Task: "Collection Info entity in src/models/collection-info.ts"
Task: "UI State entity in src/models/ui-state.ts"
```

## Notes
- [P] tasks = different files, no dependencies, can run in parallel
- Verify all tests fail before implementing any functionality
- Commit after each task completion
- Follow TDD: Red → Green → Refactor cycle
- Use absolute paths for all file references
- Avoid modifying the same file in parallel tasks

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (4 contracts → 4 tests)
- [x] All entities have model tasks (6 entities → 6 tasks)
- [x] All tests come before implementation (TDD compliance)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/005-vscode-extension-scaffold/tasks.md