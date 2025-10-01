import * as vscode from 'vscode';
/**
 * Command Result
 *
 * Result returned by command execution with success status and metadata
 */
export interface CommandResult {
    /** Whether the command executed successfully */
    success: boolean;
    /** Method used to open settings ('ui' or 'file') */
    method: 'ui' | 'file';
    /** Error if command failed */
    error?: string;
    /** Additional metadata */
    metadata?: {
        /** Timestamp of execution */
        executedAt?: Date;
        /** VSCode version */
        vscodeVersion?: string;
        /** Whether fallback was used */
        usedFallback?: boolean;
    };
}
/**
 * Command identifier for opening Qdrant configuration
 */
export declare const OPEN_CONFIG_COMMAND_ID = "qdrant.openConfig";
/**
 * Registers the open configuration command with VSCode
 */
export declare function registerOpenConfigCommand(context: vscode.ExtensionContext): vscode.Disposable;
/**
 * Executes the open configuration command
 */
export declare function executeOpenConfigCommand(): Promise<CommandResult>;
/**
 * Convenience function to execute the open config command
 */
export declare function openQdrantConfig(): Promise<CommandResult>;
//# sourceMappingURL=open-config.d.ts.map