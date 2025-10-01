# Data Model: Linting and Formatting

## Configuration Entities

### Biome Configuration Entity

**Purpose**: Represents the biome.json configuration file that defines linting and formatting rules for the project.

**Attributes**:
- `$schema`: String reference to Biome JSON schema for IDE support
- `formatter`: Object containing formatting configuration
  - `enabled`: Boolean (true)
  - `indentStyle`: Enum ("space")
  - `indentWidth`: Number (2)
  - `lineWidth`: Number (100)
- `linter`: Object containing linting configuration
  - `enabled`: Boolean (true)
  - `rules`: Object of rule configurations
- `organizeImports`: Object for import organization
  - `enabled`: Boolean (true)
- `files`: Object defining which files to include/exclude
  - `include`: Array of file patterns (["src/**/*.ts", "tests/**/*.ts"])
  - `ignore`: Array of exclusion patterns (["dist/", "node_modules/", ".vscode/"])

**Validation Rules**:
- `formatter.enabled` must be `true`
- `linter.enabled` must be `true`
- `formatter.indentWidth` must be 2 (TypeScript standard)
- `formatter.lineWidth` must be ≤ 120 characters
- `files.ignore` must include dist/, node_modules/

**State Transitions**:
- Draft → Validated → Active
- Active → Modified → Validated
- Configuration changes trigger re-linting/reformatting

### VS Code Workspace Settings Entity

**Purpose**: Represents the .vscode/settings.json configuration that integrates Biome with VS Code.

**Attributes**:
- `editor.formatOnSave`: Boolean (true) - enables auto-formatting
- `editor.defaultFormatter`: String ("biomejs.biome") - sets Biome as formatter
- `editor.codeActionsOnSave`: Object for save actions
  - `quickfix.biome`: String ("explicit")
  - `source.organizeImports.biome`: String ("explicit")
- Language-specific settings: Object with TypeScript overrides

**Validation Rules**:
- `editor.formatOnSave` must be `true`
- `editor.defaultFormatter` must be "biomejs.biome" for TypeScript files
- Code actions must be configured for auto-fixing on save

**Relationships**:
- References Biome Configuration Entity for rule definitions
- Consumed by VS Code editor for save-time automation

### Linting Rule Configuration Entity

**Purpose**: Represents individual linting rules and their severity levels.

**Attributes**:
- `ruleName`: String identifier for the rule
- `severity`: Enum ("error", "warn", "off")
- `options`: Object with rule-specific configuration (optional)
- `category`: String classification (correctness, style, performance, suspicious)

**Validation Rules**:
- Severity must be valid enum value
- Rules from "correctness" category should be "error" severity
- Rules must be compatible with TypeScript strict mode

**Relationships**:
- Belongs to Biome Configuration Entity
- Applied during linting validation process

### Formatting Rule Entity

**Purpose**: Represents formatting preferences for code style consistency.

**Attributes**:
- `quoteStyle`: Enum ("single", "double")
- `semicolons`: Enum ("always", "asNeeded")
- `trailingComma`: Enum ("all", "es5", "none")
- `arrowParens`: Enum ("always", "asNeeded")
- `bracketSpacing`: Boolean

**Validation Rules**:
- Quote style must be consistent across project
- Semicolons should be "always" for TypeScript
- Formatting must not conflict with linting rules

**Lifecycle**:
- Applied on save
- Applied on manual format command
- Validated in CI pipeline

### Validation Report Entity

**Purpose**: Represents the output of linting and formatting operations.

**Attributes**:
- `filePath`: Absolute path to file being validated
- `errors`: Array of error objects
  - `line`: Number
  - `column`: Number
  - `message`: String
  - `rule`: String (rule name)
  - `severity`: Enum ("error", "warn")
  - `fixable`: Boolean
- `warnings`: Array of warning objects (same structure as errors)
- `formattingIssues`: Array of formatting violation objects
- `totalIssues`: Number (count of errors + warnings)
- `fixableIssues`: Number (count of auto-fixable issues)

**Validation Rules**:
- File path must be absolute and exist
- Line and column numbers must be positive integers
- Severity must match rule configuration

**State Transitions**:
- Created after each linting/formatting run
- Displayed in VS Code Problems panel
- Cleared when issues are fixed

### File Watch Pattern Entity

**Purpose**: Represents patterns defining which files trigger linting and formatting.

**Attributes**:
- `include`: Array of glob patterns to include
- `exclude`: Array of glob patterns to exclude
- `watchExtensions`: Array of file extensions ([".ts", ".tsx"])

**Validation Rules**:
- Must exclude generated directories (dist/, node_modules/)
- Must include source and test directories (src/, tests/)
- Patterns must be valid glob syntax

**Relationships**:
- Referenced by Biome Configuration Entity
- Used by VS Code file watcher for save triggers
- Applied in build scripts for manual linting/formatting

## Build Script Configuration Entity

**Purpose**: Represents npm scripts for manual linting and formatting commands.

**Attributes**:
- `lint`: String command for linting check
- `lint:fix`: String command for auto-fixing linting issues
- `format`: String command for formatting check
- `format:fix`: String command for auto-formatting
- `pretest`: String command including linting validation

**Validation Rules**:
- All commands must use Biome CLI
- Commands must target project root or specific patterns
- pretest must include linting before compilation

**Lifecycle**:
- Invoked manually by developers
- Executed automatically in CI pipeline
- Part of pre-commit validation workflow
