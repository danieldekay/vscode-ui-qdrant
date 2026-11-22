import type { FileValidationResult } from './fileValidation';

/**
 * Enhanced validation result with detailed error explanations and remediation suggestions
 */
export interface EnhancedValidationResult {
  /** Core validation outcome from existing system */
  basicResult: FileValidationResult;
  /** User-friendly error explanation */
  simpleMessage: string;
  /** Optional technical error information for advanced users */
  technicalDetails?: string;
  /** List of suggested fixes */
  remediationSuggestions: ValidationSuggestion[];
  /** Available quick action buttons */
  quickActions: QuickAction[];
  /** Depth of validation performed */
  validationLevel: ValidationLevel;
  /** Timing and resource usage data */
  performanceMetrics: ValidationMetrics;
}

/**
 * Specific recommendation for fixing a validation issue
 */
export interface ValidationSuggestion {
  /** Unique identifier for the suggestion */
  suggestionId: string;
  /** Brief description of the suggested fix */
  title: string;
  /** Detailed explanation of the remediation */
  description: string;
  /** Category of suggested action */
  actionType: SuggestionActionType;
  /** Importance level of this suggestion */
  priority: SuggestionPriority;
  /** Expected complexity to implement */
  estimatedEffort: EffortLevel;
  /** Required conditions before applying suggestion */
  prerequisites: string[];
  /** IDs of quick actions that implement this suggestion */
  relatedActions: string[];
}

/**
 * Performance metrics for validation operations
 */
export interface ValidationMetrics {
  /** Time taken for validation in milliseconds */
  validationDuration: number;
  /** Number of bytes read during validation */
  bytesRead: number;
  /** Number of validation checks performed */
  checksPerformed: number;
  /** Memory usage during validation (optional) */
  memoryUsage?: number;
}

/**
 * Layered error messages for different detail levels
 */
export interface LayeredMessages {
  /** Simple, user-friendly message */
  simple: string;
  /** Detailed message with context and suggestions */
  detailed: string;
  /** Technical message with full diagnostic information */
  technical: string;
}

/**
 * Depth of validation performed
 */
export enum ValidationLevel {
  /** File existence and permissions only */
  BASIC = 'basic',
  /** Header and basic structure validation */
  STRUCTURAL = 'structural',
  /** Full integrity checking (not used in this feature) */
  COMPREHENSIVE = 'comprehensive',
}

/**
 * Category of suggested action
 */
export enum SuggestionActionType {
  /** File or directory operations */
  FILE_SYSTEM = 'file_system',
  /** Access rights modifications */
  PERMISSIONS = 'permissions',
  /** Qdrant-specific operations */
  QDRANT_SERVICE = 'qdrant_service',
  /** Configuration changes */
  VS_CODE_SETTINGS = 'vs_code_settings',
  /** Informational suggestions */
  USER_GUIDANCE = 'user_guidance',
}

/**
 * Importance level of a suggestion
 */
export enum SuggestionPriority {
  /** Must fix to proceed */
  CRITICAL = 'critical',
  /** Strongly recommended */
  IMPORTANT = 'important',
  /** Nice to have improvement */
  OPTIONAL = 'optional',
}

/**
 * Expected complexity to implement a suggestion
 */
export enum EffortLevel {
  /** One-click fix */
  IMMEDIATE = 'immediate',
  /** Basic user action required */
  SIMPLE = 'simple',
  /** Multiple steps needed */
  MODERATE = 'moderate',
  /** Advanced user knowledge required */
  COMPLEX = 'complex',
}

/**
 * Actionable button for immediate error remediation
 */
export interface QuickAction {
  /** Unique identifier for the action */
  actionId: string;
  /** Button text displayed to user */
  label: string;
  /** Tooltip or expanded description */
  description: string;
  /** Type of action (file, VS Code, Qdrant) */
  actionCategory: ActionCategory;
  /** VS Code command to execute */
  vsCodeCommand?: string;
  /** Arguments for the VS Code command */
  commandArgs?: unknown[];
  /** Whether action needs user confirmation */
  requiresConfirmation: boolean;
  /** Whether action modifies files or settings */
  isDestructive: boolean;
  /** Expected execution time in milliseconds */
  estimatedDuration: number;
}

/**
 * Type of action category
 */
export enum ActionCategory {
  /** File system actions (permissions, open folder) */
  FILE_OPERATIONS = 'file_operations',
  /** Qdrant service actions (restart, connect) */
  QDRANT_OPERATIONS = 'qdrant_operations',
  /** VS Code actions (settings, commands) */
  VS_CODE_OPERATIONS = 'vs_code_operations',
  /** Informational actions (show help, documentation) */
  GUIDANCE_OPERATIONS = 'guidance_operations',
}
