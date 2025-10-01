# Quick Start: Qdrant UX Inside VSCode

**Feature**: Qdrant UX Inside VSCode
**Date**: 2025-10-01

## Overview

This guide provides a rapid implementation path for the Qdrant search interface feature. Follow these steps to implement the core search functionality within VS Code.

## Prerequisites

- VS Code extension development environment set up
- @qdrant/js-client-rest package installed
- Existing Qdrant service integration
- Webview API knowledge

## Implementation Steps

### Step 1: Create Search Command Registration

Add the search command to `package.json`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "qdrant.search",
        "title": "Qdrant: Search"
      }
    ]
  }
}
```

### Step 2: Implement Search Command Handler

Create `src/commands/search.ts`:

```typescript
import * as vscode from 'vscode';
import { QdrantSearchPanel } from '../panels/searchPanel';

export function registerSearchCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('qdrant.search', () => {
    QdrantSearchPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(disposable);
}
```

### Step 3: Create Webview Panel Class

Create `src/panels/searchPanel.ts`:

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export class QdrantSearchPanel {
  public static currentPanel: QdrantSearchPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._setupWebview();
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.One;

    if (QdrantSearchPanel.currentPanel) {
      QdrantSearchPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'qdrantSearch',
      'Qdrant Search',
      column,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri]
      }
    );

    QdrantSearchPanel.currentPanel = new QdrantSearchPanel(panel, extensionUri);
  }

  private _setupWebview() {
    this._panel.webview.html = this._getHtmlForWebview();
    this._panel.onDidDispose(() => this.dispose(), null, []);
  }

  private _getHtmlForWebview(): string {
    // Return HTML content for search interface
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Qdrant Search</title>
          <style>
            body { font-family: var(--vscode-font-family); }
            .search-container { padding: 20px; }
            .search-input { width: 100%; padding: 8px; margin-bottom: 10px; }
            .parameters { display: flex; gap: 10px; margin-bottom: 20px; }
            .results-table { width: 100%; border-collapse: collapse; }
            .results-table th, .results-table td {
              border: 1px solid var(--vscode-panel-border);
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="search-container">
            <h2>Qdrant Search</h2>
            <input type="text" class="search-input" placeholder="Enter search query..." />
            <div class="parameters">
              <label>Similarity: <input type="number" min="0" max="1" step="0.1" value="0.7" /></label>
              <label>Limit: <input type="number" min="1" max="1000" value="50" /></label>
            </div>
            <button onclick="performSearch()">Search</button>
            <table class="results-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Score</th>
                  <th>Content Preview</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody id="results-body">
                <!-- Results will be populated here -->
              </tbody>
            </table>
          </div>
          <script>
            // Webview JavaScript will go here
          </script>
        </body>
      </html>
    `;
  }

  public dispose() {
    QdrantSearchPanel.currentPanel = undefined;
    this._panel.dispose();
  }
}
```

### Step 4: Integrate with Qdrant Service

Update the webview to communicate with the Qdrant service:

```typescript
// In searchPanel.ts, add message handling
this._panel.webview.onDidReceiveMessage(
  async (message) => {
    switch (message.type) {
      case 'search':
        await this._handleSearch(message.query, message.parameters);
        break;
    }
  },
  undefined,
  []
);

private async _handleSearch(query: string, parameters: any) {
  try {
    // Call Qdrant service
    const results = await qdrantService.search(query, parameters);

    // Send results back to webview
    this._panel.webview.postMessage({
      type: 'searchResults',
      results: results
    });
  } catch (error) {
    this._panel.webview.postMessage({
      type: 'searchError',
      error: error.message
    });
  }
}
```

### Step 5: Add Parameter Controls

Enhance the HTML with dynamic parameter controls:

```html
<div class="parameter-controls">
  <div class="control-group">
    <label for="similarity-threshold">Similarity Threshold:</label>
    <input type="range" id="similarity-threshold" min="0" max="1" step="0.05" value="0.7" />
    <span id="similarity-value">0.7</span>
  </div>

  <div class="control-group">
    <label for="result-limit">Result Limit:</label>
    <input type="number" id="result-limit" min="1" max="1000" value="50" />
  </div>

  <div class="control-group">
    <label for="search-filter">Filter:</label>
    <input type="text" id="search-filter" placeholder="field=value" />
  </div>
</div>
```

### Step 6: Implement Result Display

Add JavaScript to populate the results table:

```javascript
function displayResults(results) {
  const tbody = document.getElementById('results-body');
  tbody.innerHTML = '';

  results.forEach(result => {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = result.id;
    row.appendChild(idCell);

    const scoreCell = document.createElement('td');
    scoreCell.textContent = result.score.toFixed(3);
    row.appendChild(scoreCell);

    const contentCell = document.createElement('td');
    contentCell.textContent = truncateText(getContentPreview(result), 100);
    row.appendChild(contentCell);

    const metadataCell = document.createElement('td');
    metadataCell.textContent = JSON.stringify(result.payload, null, 2);
    row.appendChild(metadataCell);

    tbody.appendChild(row);
  });
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getContentPreview(result) {
  // Extract meaningful content from payload
  return result.payload?.content || result.payload?.text || 'No content available';
}
```

### Step 7: Add Error Handling

Implement connection status and error display:

```typescript
private async _checkConnection() {
  try {
    const status = await qdrantService.getConnectionStatus();
    this._panel.webview.postMessage({
      type: 'connectionStatus',
      connected: status.connected,
      collection: status.collection
    });
  } catch (error) {
    this._panel.webview.postMessage({
      type: 'connectionError',
      error: error.message
    });
  }
}
```

### Step 8: Register Command in Extension

Update `src/extension.ts` to register the search command:

```typescript
import { registerSearchCommand } from './commands/search';

export function activate(context: vscode.ExtensionContext) {
  // ... existing code ...

  // Register search command
  registerSearchCommand(context);

  // ... existing code ...
}
```

## Testing Checklist

- [ ] Search command opens webview panel
- [ ] Webview displays search input and parameter controls
- [ ] Search executes and displays results in table format
- [ ] Parameter changes trigger new searches
- [ ] Error states display appropriate messages
- [ ] Connection status is properly indicated

## Next Steps

1. Implement advanced filtering options
2. Add result pagination for large datasets
3. Implement result export functionality
4. Add search history and favorites
5. Enhance error recovery mechanisms

## Troubleshooting

**Webview not loading**: Check that `enableScripts: true` is set in panel options
**Search failing**: Verify Qdrant service is properly configured and accessible
**Styling issues**: Ensure VS Code theme variables are used for consistent appearance
**Performance problems**: Implement virtual scrolling for large result sets