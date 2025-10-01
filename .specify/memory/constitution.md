<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
List of modified principles: None renamed
Added sections: Technology Stack Requirements, Code Quality Standards, Tooling Philosophy, File Structure Requirements
Removed sections: None
Templates requiring updates: ✅ updated plan-template.md
Follow-up TODOs: None
-->

# VSCode UI Qdrant Constitution

## Core Principles

### I. Extension-First Architecture

Every feature must be designed as a cohesive VS Code extension component. All functionality MUST integrate seamlessly with VS Code's existing UI patterns and workflows. Components must respect VS Code's extension API boundaries and lifecycle. No feature shall bypass or circumvent VS Code's extension security model.

### II. Qdrant API Integrity (NON-NEGOTIABLE)

All Qdrant interactions MUST use official Qdrant REST API or gRPC interfaces exclusively. Direct database file manipulation is forbidden. API calls must handle connection failures gracefully with user-visible error states. All Qdrant operations must preserve data integrity and follow Qdrant's documented best practices.

### III. Test-First Development (NON-NEGOTIABLE)

TDD mandatory for all user-facing features: UI component tests written → User approved → Tests fail → Then implement. Integration tests required for all Qdrant API interactions. Mock Qdrant instances for testing must not require external dependencies. Red-Green-Refactor cycle strictly enforced.

### IV. Progressive Enhancement UI

All UI features must work without blocking VS Code's core functionality. Qdrant connection failures must degrade gracefully to informational states rather than breaking the extension. Critical operations require confirmation dialogs with clear rollback options. Loading states must be visible for operations exceeding 200ms.

### V. Developer Experience First

All features must reduce cognitive load for vector database operations. Complex Qdrant concepts must be presented through intuitive VS Code UI metaphors. Operations must provide immediate feedback and clear next steps. Error messages must be actionable with suggested remediation steps.

## Technology Stack Requirements

**Language**: TypeScript 5.x with strict mode enabled MUST be used for all extension code. **Runtime**: Node.js LTS (20.x or higher) required for compatibility and security. **Package Manager**: npm or pnpm MUST be used consistently throughout the project. All dependencies MUST be locked to specific versions in package-lock.json or pnpm-lock.yaml.

## Code Quality Standards

All code MUST pass TypeScript type checking with `tsc --noEmit`. All code MUST pass linting checks without exceptions. All code MUST be formatted consistently using automated tools. No unused variables or imports allowed in committed code. Strict TypeScript compiler options required including noImplicitAny, strictNullChecks, and noImplicitReturns.

## Tooling Philosophy

Prefer modern, actively-maintained tools (2025-current) with active community support. Favor single-purpose tools that do one thing well over monolithic solutions. All development tools MUST be lockable to specific versions in package.json. CI MUST validate all quality checks before allowing merges. Tool configurations MUST be committed to version control.

## File Structure Requirements

Source code MUST be organized in `src/` directory. Build output MUST be placed in `dist/` directory and excluded from version control. Configuration files MUST be placed at project root for discoverability. All configuration files MUST be committed to version control for reproducible builds.

## User Experience Standards

Extension must follow VS Code UI/UX guidelines strictly. Tree views, panels, and commands must use standard VS Code patterns. Keyboard shortcuts must not conflict with VS Code defaults. All user actions must be reversible or have clear confirmation flows. Progress indicators required for long-running operations.

## Technical Standards

TypeScript mandatory for all extension code with strict type checking enabled. VS Code API usage must target minimum supported version. All async operations must handle cancellation tokens properly. Configuration must use VS Code's settings system exclusively. Extension activation must be lazy and event-driven.

## Governance

Constitution supersedes all implementation preferences and coding conventions. All feature specifications must verify compliance with each principle before implementation begins. Violations require explicit justification and architectural alternatives evaluation. This constitution serves as the final authority for design decisions and trade-off resolution.

**Version**: 1.1.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-01
