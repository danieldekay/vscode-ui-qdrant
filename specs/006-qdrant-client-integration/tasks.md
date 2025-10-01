# Tasks: Qdrant Client Integration

**Input**: Design documents from `/specs/006-qdrant-client-integration/`  
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```text
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: TypeScript 5.x, @qdrant/js-client-rest, VS Code Extension API, Mocha testing
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: qdrant-service.contract.md → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project structure, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: error types, validation, service implementation
   → Integration: VS Code extension integration
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

- **VS Code Extension**: `src/` at repository root
- **Tests**: `tests/` at repository root
- **Types**: `src/types/`
- **Services**: `src/services/`
- **Validation**: `src/validation/`

## Phase 3.1: Setup

- [x] T001 Create project structure per implementation plan
- [x] T002 Install @qdrant/js-client-rest dependency
- [x] T003 [P] Configure Mocha test framework in package.json

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

> **CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004 [P] Contract test for IQdrantService interface in tests/contract/test-qdrant-service.contract.ts
- [x] T005 [P] Integration test for basic connection workflow in tests/integration/test-connection.integration.ts
- [x] T006 [P] Integration test for collection operations in tests/integration/test-collections.integration.ts
- [x] T007 [P] Integration test for vector search operations in tests/integration/test-search.integration.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T008 [P] QdrantError base class and error hierarchy in src/types/errors.ts
- [x] T009 [P] QdrantConfig and CollectionConfig interfaces in src/types/qdrant.ts
- [x] T010 [P] VectorData and SearchRequest interfaces in src/types/qdrant.ts
- [x] T011 [P] Collection name validation function in src/validation/collection.ts
- [x] T012 [P] Vector validation function in src/validation/vector.ts
- [x] T013 QdrantService class implementation in src/services/qdrant-service.ts
- [x] T014 Connection management methods in src/services/qdrant-service.ts
- [x] T015 Collection operations methods in src/services/qdrant-service.ts
- [x] T016 Vector operations methods in src/services/qdrant-service.ts

## Phase 3.4: Integration ✅ COMPLETED

- [x] T017 VS Code extension configuration schema in package.json
- [x] T018 Service injection in extension activation in src/extension.ts
- [x] T019 Configuration management from VS Code settings in src/services/qdrant-service.ts
- [x] T020 Error handling integration with VS Code UI in src/extension.ts

## Phase 3.5: Polish

- [ ] T021 [P] Unit tests for collection validation in tests/unit/test-collection-validation.unit.ts
- [ ] T022 [P] Unit tests for vector validation in tests/unit/test-vector-validation.unit.ts
- [ ] T023 [P] Unit tests for error classes in tests/unit/test-errors.unit.ts
- [ ] T024 Performance validation (<10 concurrent searches)
- [ ] T025 [P] Update README.md with Qdrant integration docs
- [ ] T026 Remove code duplication and refactor
- [ ] T027 Run manual testing scenarios from quickstart.md

## Dependencies

- Tests (T004-T007) before implementation (T008-T016)
- T008 blocks T013 (error types needed for service)
- T009-T010 blocks T013 (interfaces needed for service)
- T011-T012 blocks T013 (validation needed for service)
- T013 blocks T014-T016 (service class needed for methods)
- T014 blocks T017-T020 (connection needed for integration)
- Implementation before polish (T021-T027)

## Parallel Example

```bash
# Launch T004-T007 together:
Task: "Contract test for IQdrantService interface in tests/contract/test-qdrant-service.contract.ts"
Task: "Integration test for basic connection workflow in tests/integration/test-connection.integration.ts"
Task: "Integration test for collection operations in tests/integration/test-collections.integration.ts"
Task: "Integration test for vector search operations in tests/integration/test-search.integration.ts"
```

```bash
# Launch T008-T012 together:
Task: "QdrantError base class and error hierarchy in src/types/errors.ts"
Task: "QdrantConfig and CollectionConfig interfaces in src/types/qdrant.ts"
Task: "VectorData and SearchRequest interfaces in src/types/qdrant.ts"
Task: "Collection name validation function in src/validation/collection.ts"
Task: "Vector validation function in src/validation/vector.ts"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules

Applied during main() execution

1. **From Contracts**:
   - qdrant-service.contract.md → contract test task [P]
   - IQdrantService interface → implementation tasks

2. **From Data Model**:
   - Error types → error class tasks [P]
   - Config interfaces → type definition tasks [P]
   - Validation rules → validation function tasks [P]

3. **From User Stories**:
   - Quickstart scenarios → integration test tasks [P]
   - Basic usage examples → validation tasks

4. **Ordering**:
   - Setup → Tests → Types/Validation → Service → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist

GATE: Checked by main() execution

- [x] All contracts have corresponding tests (qdrant-service.contract.md → T004)
- [x] All entities have model tasks (VectorData, CollectionConfig, etc. → T009-T010)
- [x] All tests come before implementation (T004-T007 before T008-T016)
- [x] Parallel tasks truly independent (different file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
