import * as vscode from 'vscode';

/**
 * Activates the VSCode UI Qdrant extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('VSCode UI Qdrant extension is now active!');

  // Register commands
  const helloWorldCommand = vscode.commands.registerCommand('vscode-ui-qdrant.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from VSCode UI Qdrant!');
  });

  context.subscriptions.push(helloWorldCommand);
}

/**
 * Deactivates the VSCode UI Qdrant extension
 */
export function deactivate() {
  console.log('VSCode UI Qdrant extension deactivated');
}
