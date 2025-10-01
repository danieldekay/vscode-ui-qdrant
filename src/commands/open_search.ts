import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
import type { SearchService } from '../services/search_service';
import { QdrantSearchPanel } from '../webview/search_panel';

/**
 * Command handler for opening the Qdrant search interface.
 */
export function registerOpenSearchCommand(
  context: vscode.ExtensionContext,
  searchService: SearchService,
  configService: ConfigService,
): vscode.Disposable {
  const disposable = vscode.commands.registerCommand('qdrant.openSearch', () => {
    try {
      QdrantSearchPanel.createOrShow(context.extensionUri, searchService, configService);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to open Qdrant search interface: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  });

  context.subscriptions.push(disposable);
  return disposable;
}
