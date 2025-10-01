# Tasks: 009-qdrant-ux-inside

**Input**: Design documents from `/specs/009-qdrant-ux-inside/`
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
- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize TypeScript project with VS Code Extension API dependencies
- [x] T003 [P] Configure linting and formatting tools (Biome)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test for search API in tests/contract/test_search_api.ts
- [x] T005 [P] Contract test for config API in tests/contract/test_config_api.ts
- [x] T006 [P] Integration test for Qdrant connection in tests/integration/test_qdrant_connection.ts
- [x] T007 [P] Integration test for search UX flow in tests/integration/test_search_ux_flow.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T008 [P] SearchResult model in src/models/search_result.ts
- [x] T009 [P] SearchConfig model in src/models/search_config.ts
- [x] T010 [P] QdrantCollection model in src/models/qdrant_collection.ts
- [x] T011 [P] SearchParameters model in src/models/search_parameters.ts
- [x] T012 [P] VectorPoint model in src/models/vector_point.ts
- [x] T013 [P] SearchResponse model in src/models/search_response.ts
- [x] T014 [P] SearchService in src/services/search_service.ts
- [x] T015 [P] ConfigService in src/services/config_service.ts
- [x] T016 [P] Webview panel for search interface in src/webview/search_panel.ts
- [x] T017 [P] Webview panel for config interface in src/webview/config_panel.ts
- [x] T018 Register open-search command in src/commands/open_search.ts
- [x] T019 Register open-config command in src/commands/open_config.ts
- [x] T020 Implement search API endpoint in src/api/search_endpoint.ts
- [x] T021 Implement config API endpoint in src/api/config_endpoint.ts
- [x] T022 Input validation for search parameters
- [x] T023 Error handling and logging

## Phase 3.4: Integration
- [x] T024 Connect SearchService to Qdrant client
- [x] T025 Connect ConfigService to VS Code settings
- [x] T026 Webview message passing for search results
- [x] T027 Webview message passing for config updates
- [x] T028 CORS and security headers for webview

## Phase 3.5: Polish
- [ ] T029 [P] Unit tests for models in tests/unit/test_models.ts
- [ ] T030 [P] Unit tests for services in tests/unit/test_services.ts
- [ ] T031 Performance tests (<200ms response time)
- [ ] T032 [P] Update docs/api.md
- [ ] T033 Remove code duplication
- [ ] T034 Run manual-testing.md

## Dependencies
- Tests (T004-T007) before implementation (T008-T023)
- T008-T013 blocks T014-T015, T022
- T016-T017 blocks T026-T027
- Implementation before polish (T029-T034)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Contract test for search API in tests/contract/test_search_api.ts"
Task: "Contract test for config API in tests/contract/test_config_api.ts"
Task: "Integration test for Qdrant connection in tests/integration/test_qdrant_connection.ts"
Task: "Integration test for search UX flow in tests/integration/test_search_ux_flow.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

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

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task