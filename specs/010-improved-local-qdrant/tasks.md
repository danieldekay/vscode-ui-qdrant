# Tasks: Improved Local Qdrant Database Configuration

**Input**: Design documents from `/specs/010-improved-local-qdrant/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript 5.x, VS Code Extension API, TDD approach
2. Load design documents:
   → data-model.md: 5 entities → type definition tasks
   → contracts/: 3 services → contract test tasks
   → quickstart.md: 5 scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: TypeScript types, enhanced services
   → Tests: contract tests, integration tests
   → Core: discovery service, enhanced validation, command enhancement
   → Integration: error handling, progress reporting
   → Polish: unit tests, performance validation
4. Apply TDD rules:
   → Contract tests before implementations
   → Integration tests before command enhancements
   → Types before services
5. Number tasks sequentially (T001, T002...)
6. Generate parallel execution groups
7. Validate completeness: all contracts tested, all entities typed
8. Return: SUCCESS (18 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **VS Code Extension**: `src/` at repository root
- Types in `src/types/`
- Services in `src/services/`
- Commands in `src/commands/`
- Tests in `tests/`

## Phase 3.1: Setup and Type Definitions
- [x] T001 [P] Create enhanced discovery types in src/types/discovery.ts
- [x] T002 [P] Create enhanced validation types in src/types/enhancedValidation.ts
- [x] T003 [P] Create quick action types in src/types/quickActions.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test DiscoveryService.discoverDatabases in tests/contract/discoveryService.contract.test.ts
- [ ] T005 [P] Contract test FileService.validateQdrantFileEnhanced in tests/contract/enhancedValidation.contract.test.ts
- [ ] T006 [P] Contract test qdrant.selectLocalDbFileEnhanced command in tests/contract/enhancedSelection.contract.test.ts
- [ ] T007 [P] Integration test auto-discovery success scenario in tests/integration/autoDiscoverySuccess.test.ts
- [ ] T008 [P] Integration test enhanced error messages scenario in tests/integration/enhancedErrorMessages.test.ts
- [ ] T009 [P] Integration test quick action remediation scenario in tests/integration/quickActionRemediation.test.ts
- [ ] T010 [P] Integration test multiple database handling scenario in tests/integration/multipleDatabaseHandling.test.ts
- [ ] T011 [P] Integration test performance and cancellation scenario in tests/integration/performanceCancellation.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T012 [P] Implement DiscoveryService class in src/services/discoveryService.ts
- [ ] T013 Enhance FileService with validateQdrantFileEnhanced method in src/services/fileService.ts
- [ ] T014 [P] Create enhanced error message utilities in src/utils/enhancedErrorHandling.ts
- [ ] T015 [P] Create quick action command integration in src/utils/quickActionCommands.ts
- [ ] T016 Enhance selectDbFile command with auto-discovery in src/commands/selectDbFile.ts

## Phase 3.4: Integration and UI Enhancement
- [ ] T017 Integrate progress reporting and cancellation support in src/commands/selectDbFile.ts
- [ ] T018 [P] Add enhanced error dialog with technical details toggle in src/utils/enhancedErrorHandling.ts

## Dependencies
- Type definitions (T001-T003) before all implementation
- All tests (T004-T011) before implementation (T012-T018)
- T012 (DiscoveryService) blocks T016 (command enhancement)
- T013 (enhanced validation) blocks T016 (command enhancement)
- T014-T015 (utilities) before T016-T018 (integration)

## Parallel Example
```
# Launch T001-T003 together (type definitions):
Task: "Create enhanced discovery types in src/types/discovery.ts"
Task: "Create enhanced validation types in src/types/enhancedValidation.ts"
Task: "Create quick action types in src/types/quickActions.ts"

# Launch T004-T011 together (contract and integration tests):
Task: "Contract test DiscoveryService.discoverDatabases in tests/contract/discoveryService.contract.test.ts"
Task: "Contract test FileService.validateQdrantFileEnhanced in tests/contract/enhancedValidation.contract.test.ts"
Task: "Contract test qdrant.selectLocalDbFileEnhanced command in tests/contract/enhancedSelection.contract.test.ts"
Task: "Integration test auto-discovery success scenario in tests/integration/autoDiscoverySuccess.test.ts"
Task: "Integration test enhanced error messages scenario in tests/integration/enhancedErrorMessages.test.ts"
Task: "Integration test quick action remediation scenario in tests/integration/quickActionRemediation.test.ts"
Task: "Integration test multiple database handling scenario in tests/integration/multipleDatabaseHandling.test.ts"
Task: "Integration test performance and cancellation scenario in tests/integration/performanceCancellation.test.ts"

# Launch T012, T014-T015 together (independent implementations):
Task: "Implement DiscoveryService class in src/services/discoveryService.ts"
Task: "Create enhanced error message utilities in src/utils/enhancedErrorHandling.ts"
Task: "Create quick action command integration in src/utils/quickActionCommands.ts"
```

## Detailed Task Specifications

### T001 [P] Create enhanced discovery types in src/types/discovery.ts
- Define `DatabaseDiscoveryResult` interface with all fields from data model
- Define `AutoDiscoveryConfig` interface for scan configuration
- Define `DiscoveryError` interface for scan error handling
- Include supporting enums: `ValidationLevel`, `SuggestionActionType`, `SuggestionPriority`, `EffortLevel`, `ActionCategory`
- Export all types for use by services and commands

### T002 [P] Create enhanced validation types in src/types/enhancedValidation.ts
- Define `EnhancedValidationResult` interface extending existing `FileValidationResult`
- Define `ValidationSuggestion` interface with remediation details
- Define `ValidationMetrics` interface for performance tracking
- Include relationship types between validation results and suggestions
- Ensure compatibility with existing validation infrastructure

### T003 [P] Create quick action types in src/types/quickActions.ts
- Define `QuickAction` interface for UI action buttons
- Define action category enums and command integration types
- Include VS Code command integration types for action execution
- Define confirmation and destructive action handling types
- Export types for use in error handling and UI components

### T004 [P] Contract test DiscoveryService.discoverDatabases in tests/contract/discoveryService.contract.test.ts
- Test workspace-scoped directory scanning behavior
- Verify 3-second timeout compliance
- Test file grouping by directory functionality
- Verify progress reporting and cancellation support
- Test error handling for inaccessible directories
- Mock VS Code workspace.fs API for controlled testing

### T005 [P] Contract test FileService.validateQdrantFileEnhanced in tests/contract/enhancedValidation.contract.test.ts
- Test enhanced validation with layered error messaging
- Verify simple message generation for various error types
- Test technical details generation and optional display
- Verify quick action button generation based on error category
- Test validation performance metrics collection
- Ensure backward compatibility with existing validation

### T006 [P] Contract test qdrant.selectLocalDbFileEnhanced command in tests/contract/enhancedSelection.contract.test.ts
- Test command registration and execution flow
- Verify auto-discovery dialog presentation
- Test file selection with enhanced validation
- Verify configuration update on successful selection
- Test error handling with quick action integration
- Mock VS Code UI APIs for dialog and notification testing

### T007 [P] Integration test auto-discovery success scenario in tests/integration/autoDiscoverySuccess.test.ts
- Create test workspace with multiple database files in different directories
- Execute enhanced selection command
- Verify auto-discovery finds all files within timeout
- Test directory grouping and file count display
- Verify successful file selection and configuration update
- Based on quickstart.md Scenario 1 specifications

### T008 [P] Integration test enhanced error messages scenario in tests/integration/enhancedErrorMessages.test.ts
- Create test files with various permission and format issues
- Execute selection and validation flow
- Verify layered error message presentation (simple + technical details)
- Test "Show technical details" functionality
- Verify appropriate error categorization and messaging
- Based on quickstart.md Scenario 2 specifications

### T009 [P] Integration test quick action remediation scenario in tests/integration/quickActionRemediation.test.ts
- Create error scenarios requiring remediation
- Execute validation and error handling flow
- Test quick action button generation and execution
- Verify VS Code command integration for actions
- Test confirmation dialogs for destructive actions
- Based on quickstart.md Scenario 3 specifications

### T010 [P] Integration test multiple database handling scenario in tests/integration/multipleDatabaseHandling.test.ts
- Create workspace with databases in multiple directories
- Execute auto-discovery flow
- Verify directory grouping and file count presentation
- Test selection from different directory groups
- Verify configuration updates for different selections
- Based on quickstart.md Scenario 4 specifications

### T011 [P] Integration test performance and cancellation scenario in tests/integration/performanceCancellation.test.ts
- Create large workspace structure for performance testing
- Execute auto-discovery with timeout scenarios
- Test progress reporting during long operations
- Verify cancellation support and immediate termination
- Test partial results on timeout with clear messaging
- Based on quickstart.md Scenario 5 specifications

### T012 [P] Implement DiscoveryService class in src/services/discoveryService.ts
- Implement workspace-scoped directory scanning using VS Code workspace.fs API
- Add timeout handling with 3-second default limit
- Implement file grouping by directory with count tracking
- Add progress reporting integration for long operations
- Implement cancellation token support for user cancellation
- Include error handling for inaccessible directories and permission issues

### T013 Enhance FileService with validateQdrantFileEnhanced method in src/services/fileService.ts
- Extend existing `validateQdrantFile` method with enhanced result generation
- Implement layered error message creation (simple + technical)
- Add quick action button generation based on error categories
- Include validation performance metrics collection
- Maintain backward compatibility with existing validation infrastructure
- Integrate with research.md validation strategy decisions

### T014 [P] Create enhanced error message utilities in src/utils/enhancedErrorHandling.ts
- Implement simple error message generation for different error types
- Add technical details extraction and formatting
- Create error categorization logic for appropriate messaging
- Implement VS Code notification integration with layered details
- Add support for expandable "Show technical details" functionality
- Include error recovery suggestion generation

### T015 [P] Create quick action command integration in src/utils/quickActionCommands.ts
- Implement quick action button generation based on error types
- Add VS Code command integration for file operations (permissions, open folder)
- Implement Qdrant service action integration (restart, connect)
- Add VS Code action integration (settings, retry)
- Include confirmation dialog handling for destructive actions
- Add action execution timing and feedback integration

### T016 Enhance selectDbFile command with auto-discovery in src/commands/selectDbFile.ts
- Enhance existing command with auto-discovery option dialog
- Integrate DiscoveryService for workspace scanning
- Add enhanced validation integration with layered error handling
- Implement directory grouping presentation for discovered files
- Add manual file selection fallback option
- Integrate quick action error remediation flow

### T017 Integrate progress reporting and cancellation support in src/commands/selectDbFile.ts
- Add VS Code progress API integration for discovery operations
- Implement cancellation token handling for user cancellation
- Add timeout handling with graceful degradation
- Integrate partial results presentation on timeout
- Add responsive UI maintenance during long operations
- Include progress indicator updates during scanning

### T018 [P] Add enhanced error dialog with technical details toggle in src/utils/enhancedErrorHandling.ts
- Implement expandable error dialog with simple/technical views
- Add "Show technical details" toggle functionality
- Integrate quick action buttons in error dialogs
- Add keyboard navigation support for accessibility
- Implement error state management and cleanup
- Include high contrast and theming support

## Notes
- [P] tasks can run in parallel (different files, no dependencies)
- All tests must fail before implementing (TDD requirement)
- Maintain compatibility with existing Qdrant extension functionality
- Focus on non-blocking operations and responsive UI
- Include accessibility and performance considerations
- Follow VS Code extension development best practices

## Validation Checklist
*GATE: Checked before task execution completion*

- [x] All 3 contracts have corresponding tests (T004-T006)
- [x] All 5 entities have type definition tasks (T001-T003)
- [x] All 5 quickstart scenarios have integration tests (T007-T011)
- [x] All tests come before implementation (T004-T011 before T012-T018)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] TDD workflow maintained throughout (tests fail first, then implement)
- [x] Constitutional requirements addressed (extension-first, test-first, progressive enhancement)