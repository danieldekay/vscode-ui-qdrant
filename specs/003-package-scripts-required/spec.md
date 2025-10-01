# Feature Specification: Package Scripts Required

**Feature Branch**: `003-package-scripts-required`
**Created**: October 1, 2025
**Status**: Draft
**Input**: User description: "# Package Scripts

## Required Scripts

All projects must include these npm scripts:

- \`typecheck\` - Run TypeScript type checking without emitting files
- \`lint\` - Run linter on all source files
- \`format\` - Auto-format all source files
- \`dev\` - Start development server with watch mode
- \`build\` - Compile TypeScript to JavaScript
- \`check\` - Run all validation checks (typecheck + lint)

## Implementation

\`\`\`json
{
  \"scripts\": {
    \"typecheck\": \"tsc --noEmit\",
    \"lint\": \"biome lint .\" OR \"eslint . --ext .ts,.tsx\",
    \"format\": \"biome format --write .\" OR \"prettier --write .\",
    \"dev\": \"tsx watch src/index.ts\",
    \"build\": \"tsc\",
    \"check\": \"npm run typecheck && npm run lint\"
  }
}
\`\`\`"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session: October 1, 2025

**TypeScript Configuration**: "user should have instructions in README"

- **Resolution**: Projects without TypeScript will include clear instructions in README.md explaining how to set up TypeScript or adapt the scripts for JavaScript-only projects.

**Linting Tool Variations**: "we imply biome. dev users are free to chose differet"

- **Resolution**: The specification implies Biome as the default linting tool, but developers are free to choose alternative tools (ESLint, Prettier, etc.) and adapt the scripts accordingly.

**Development Server Requirements**: "What if a project doesn't need a development server? - we will make a production version in a later sprint."

- **Resolution**: For projects that don't need a development server, the `dev` script will be optional. A production-ready version with proper server handling will be implemented in a future sprint.

**Script Conflicts**: "make them best practice unique names"

- **Resolution**: All required scripts will use standard, best-practice names that minimize conflicts with existing scripts. If conflicts occur, developers should rename their existing scripts to avoid collision.

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a developer working on the VSCode UI Qdrant extension, I need consistent npm scripts across all projects so that I can reliably run common development tasks like type checking, linting, formatting, and building without having to remember different command names or check each project's package.json.

### Acceptance Scenarios
1. **Given** a new developer joins the project, **When** they run `npm run check`, **Then** they get immediate feedback on code quality issues without needing to know the specific tools being used
2. **Given** a developer wants to format code, **When** they run `npm run format`, **Then** all source files are automatically formatted according to project standards
3. **Given** a developer wants to start development, **When** they run `npm run dev`, **Then** the development server starts with watch mode for automatic rebuilding
4. **Given** a CI/CD pipeline runs, **When** it executes `npm run check`, **Then** it validates both type checking and linting pass before deployment

### Edge Cases
- What happens when a project doesn't have TypeScript configured?
- How does the system handle projects with different linting tools (Biome vs ESLint)?
- What if a project doesn't need a development server?
- How are script conflicts handled when existing scripts have the same names?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: All projects MUST include a `typecheck` script that runs TypeScript type checking without emitting files
- **FR-002**: All projects MUST include a `lint` script that runs linting on all source files
- **FR-003**: All projects MUST include a `format` script that auto-formats all source files
- **FR-004**: All projects MUST include a `dev` script that starts development server with watch mode
- **FR-005**: All projects MUST include a `build` script that compiles TypeScript to JavaScript
- **FR-006**: All projects MUST include a `check` script that runs all validation checks (typecheck + lint)
- **FR-007**: The `check` script MUST run both typecheck and lint validation in sequence
- **FR-008**: Scripts MUST be executable from any project directory using standard npm commands

### Key Entities *(include if feature involves data)*
- **NPM Script**: A named command defined in package.json scripts section that can be executed via `npm run <name>`
- **Project**: A development project with package.json containing npm scripts
- **Validation Check**: An automated process that verifies code quality standards

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
