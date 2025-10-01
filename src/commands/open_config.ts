import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
import { QdrantConfigPanel } from '../webview/config_panel';

/**
 * Command handler for opening the Qdrant configuration interface.
 */
export function registerOpenConfigCommand(
  context: vscode.ExtensionContext,
  configService: ConfigService,
): vscode.Disposable {
  const disposable = vscode.commands.registerCommand('qdrant.openConfig', () => {
    try {
      QdrantConfigPanel.createOrShow(context.extensionUri, configService);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to open Qdrant configuration interface: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  });

  context.subscriptions.push(disposable);
  return disposable;
}
