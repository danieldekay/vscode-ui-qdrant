import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
import type { SearchService } from '../services/search_service';

/**
 * Webview panel for the Qdrant search interface.
 */
export class QdrantSearchPanel {
  public static currentPanel: QdrantSearchPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _searchService: SearchService;
  private readonly _configService: ConfigService;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    _extensionUri: vscode.Uri,
    searchService: SearchService,
    configService: ConfigService,
  ) {
    this._panel = panel;
    this._searchService = searchService;
    this._configService = configService;

    this._setupWebview();
    this._setupMessageHandling();
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    searchService: SearchService,
    configService: ConfigService,
  ) {
    const column = vscode.ViewColumn.One;

    if (QdrantSearchPanel.currentPanel) {
      QdrantSearchPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel('qdrantSearch', 'Qdrant Search', column, {
      enableScripts: true,
      localResourceRoots: [extensionUri],
      retainContextWhenHidden: true,
    });

    QdrantSearchPanel.currentPanel = new QdrantSearchPanel(
      panel,
      extensionUri,
      searchService,
      configService,
    );
  }

  private _setupWebview() {
    this._panel.webview.html = this._getHtmlForWebview();

    this._panel.onDidDispose(
      () => {
        QdrantSearchPanel.currentPanel = undefined;
        this.dispose();
      },
      null,
      this._disposables,
    );
  }

  private _setupMessageHandling() {
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case 'search':
            await this._handleSearch(message.query, message.parameters);
            break;
          case 'updateParameters':
            await this._handleUpdateParameters(message.parameters);
            break;
          case 'getConnectionStatus':
            await this._handleGetConnectionStatus();
            break;
          default:
            console.warn('Unknown message type:', message.type);
        }
      },
      undefined,
      this._disposables,
    );
  }

  private async _handleSearch(query: string, parameters: any) {
    try {
      this._panel.webview.postMessage({
        type: 'searchStart',
      });

      const result = await this._searchService.search(query, parameters);

      if (result.success) {
        this._panel.webview.postMessage({
          type: 'searchResults',
          results: result.data,
        });
      } else {
        this._panel.webview.postMessage({
          type: 'searchError',
          error: result.message,
        });
      }
    } catch (error) {
      this._panel.webview.postMessage({
        type: 'searchError',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async _handleUpdateParameters(parameters: any) {
    const result = await this._configService.updateSearchParameters(parameters);

    this._panel.webview.postMessage({
      type: 'parametersUpdated',
      success: result.success,
      parameters: result.validatedParameters,
    });
  }

  private async _handleGetConnectionStatus() {
    const status = this._searchService.getConnectionStatus();

    this._panel.webview.postMessage({
      type: 'connectionStatus',
      connected: status.connected,
      collection: status.collection,
    });
  }

  private _getHtmlForWebview(): string {
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this._panel.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Qdrant Search</title>
          <style>
            body {
              font-family: var(--vscode-font-family);
              font-size: var(--vscode-font-size);
              background-color: var(--vscode-editor-background);
              color: var(--vscode-editor-foreground);
              margin: 0;
              padding: 20px;
              height: 100vh;
              overflow: hidden;
            }

            .search-container {
              display: flex;
              flex-direction: column;
              height: 100%;
              gap: 20px;
            }

            .search-input-section {
              display: flex;
              gap: 10px;
              align-items: center;
            }

            .search-input {
              flex: 1;
              padding: 8px 12px;
              border: 1px solid var(--vscode-input-border);
              background-color: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border-radius: 3px;
            }

            .search-button {
              padding: 8px 16px;
              background-color: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              border-radius: 3px;
              cursor: pointer;
            }

            .search-button:hover {
              background-color: var(--vscode-button-hoverBackground);
            }

            .parameters-section {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              padding: 15px;
              background-color: var(--vscode-editorWidget-background);
              border: 1px solid var(--vscode-editorWidget-border);
              border-radius: 3px;
            }

            .parameter-group {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }

            .parameter-label {
              font-weight: 600;
              font-size: 0.9em;
            }

            .parameter-input {
              padding: 6px 8px;
              border: 1px solid var(--vscode-input-border);
              background-color: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border-radius: 3px;
            }

            .results-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              min-height: 0;
            }

            .results-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }

            .results-count {
              font-size: 0.9em;
              color: var(--vscode-descriptionForeground);
            }

            .results-table-container {
              flex: 1;
              overflow: auto;
              border: 1px solid var(--vscode-list-inactiveSelectionBackground);
              border-radius: 3px;
            }

            .results-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.9em;
            }

            .results-table th {
              position: sticky;
              top: 0;
              background-color: var(--vscode-editorWidget-background);
              border-bottom: 1px solid var(--vscode-list-inactiveSelectionBackground);
              padding: 8px 12px;
              text-align: left;
              font-weight: 600;
            }

            .results-table td {
              padding: 8px 12px;
              border-bottom: 1px solid var(--vscode-list-inactiveSelectionBackground);
              vertical-align: top;
            }

            .results-table tr:hover {
              background-color: var(--vscode-list-hoverBackground);
            }

            .score-cell {
              font-family: 'Courier New', monospace;
              font-weight: 600;
            }

            .payload-cell {
              max-width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .loading {
              text-align: center;
              padding: 40px;
              color: var(--vscode-descriptionForeground);
            }

            .error {
              background-color: var(--vscode-inputValidation-errorBackground);
              border: 1px solid var(--vscode-inputValidation-errorBorder);
              color: var(--vscode-inputValidation-errorForeground);
              padding: 10px;
              border-radius: 3px;
              margin: 10px 0;
            }

            .status-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 5px 10px;
              background-color: var(--vscode-statusBar-background);
              color: var(--vscode-statusBar-foreground);
              font-size: 0.8em;
              border-radius: 3px;
            }

            .status-connected {
              color: var(--vscode-charts-green);
            }

            .status-disconnected {
              color: var(--vscode-charts-red);
            }
          </style>
        </head>
        <body>
          <div class="search-container">
            <div class="status-bar">
              <span id="connection-status">Checking connection...</span>
              <span id="collection-info"></span>
            </div>

            <div class="search-input-section">
              <input type="text" class="search-input" id="search-query" placeholder="Enter search query..." />
              <button class="search-button" id="search-button">Search</button>
            </div>

            <div class="parameters-section">
              <div class="parameter-group">
                <label class="parameter-label" for="similarity-threshold">Similarity Threshold</label>
                <input type="range" class="parameter-input" id="similarity-threshold" min="0" max="1" step="0.05" value="0.7" />
                <span id="similarity-value">0.7</span>
              </div>

              <div class="parameter-group">
                <label class="parameter-label" for="result-limit">Result Limit</label>
                <input type="number" class="parameter-input" id="result-limit" min="1" max="1000" value="50" />
              </div>

              <div class="parameter-group">
                <label class="parameter-label" for="include-payload">Include Payload</label>
                <input type="checkbox" id="include-payload" checked />
              </div>

              <div class="parameter-group">
                <label class="parameter-label" for="include-vector">Include Vector</label>
                <input type="checkbox" id="include-vector" />
              </div>
            </div>

            <div class="results-section">
              <div class="results-header">
                <span class="results-count" id="results-count">No results</span>
              </div>

              <div class="results-table-container">
                <table class="results-table" id="results-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Score</th>
                      <th>Payload</th>
                      <th>Vector</th>
                    </tr>
                  </thead>
                  <tbody id="results-body">
                    <tr>
                      <td colspan="4" style="text-align: center; color: var(--vscode-descriptionForeground);">
                        Enter a search query to get started
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();

            // DOM elements
            const searchQuery = document.getElementById('search-query');
            const searchButton = document.getElementById('search-button');
            const similarityThreshold = document.getElementById('similarity-threshold');
            const similarityValue = document.getElementById('similarity-value');
            const resultLimit = document.getElementById('result-limit');
            const includePayload = document.getElementById('include-payload');
            const includeVector = document.getElementById('include-vector');
            const resultsBody = document.getElementById('results-body');
            const resultsCount = document.getElementById('results-count');
            const connectionStatus = document.getElementById('connection-status');
            const collectionInfo = document.getElementById('collection-info');

            // Initialize
            updateSimilarityValue();
            checkConnectionStatus();

            // Event listeners
            searchButton.addEventListener('click', performSearch);
            searchQuery.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') performSearch();
            });
            similarityThreshold.addEventListener('input', updateSimilarityValue);

            // Parameter change listeners (debounced)
            let parameterTimeout;
            function onParameterChange() {
              clearTimeout(parameterTimeout);
              parameterTimeout = setTimeout(updateParameters, 300);
            }

            resultLimit.addEventListener('change', onParameterChange);
            includePayload.addEventListener('change', onParameterChange);
            includeVector.addEventListener('change', onParameterChange);

            // Functions
            function updateSimilarityValue() {
              similarityValue.textContent = similarityThreshold.value;
            }

            function performSearch() {
              const query = searchQuery.value.trim();
              if (!query) return;

              const parameters = {
                similarityThreshold: parseFloat(similarityThreshold.value),
                resultLimit: parseInt(resultLimit.value),
                includePayload: includePayload.checked,
                includeVector: includeVector.checked
              };

              vscode.postMessage({
                type: 'search',
                query,
                parameters
              });
            }

            function updateParameters() {
              const parameters = {
                similarityThreshold: parseFloat(similarityThreshold.value),
                resultLimit: parseInt(resultLimit.value),
                includePayload: includePayload.checked,
                includeVector: includeVector.checked
              };

              vscode.postMessage({
                type: 'updateParameters',
                parameters
              });
            }

            function checkConnectionStatus() {
              vscode.postMessage({
                type: 'getConnectionStatus'
              });
            }

            // Message handling
            window.addEventListener('message', event => {
              const message = event.data;

              switch (message.type) {
                case 'searchStart':
                  resultsBody.innerHTML = '<tr><td colspan="4" class="loading">Searching...</td></tr>';
                  break;

                case 'searchResults':
                  displayResults(message.results);
                  break;

                case 'searchError':
                  displayError(message.error);
                  break;

                case 'parametersUpdated':
                  if (!message.success) {
                    console.warn('Parameter update failed');
                  }
                  break;

                case 'connectionStatus':
                  updateConnectionStatus(message.connected, message.collection);
                  break;
              }
            });

            function displayResults(results) {
              if (!results || !results.results || results.results.length === 0) {
                resultsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--vscode-descriptionForeground);">No results found</td></tr>';
                resultsCount.textContent = 'No results';
                return;
              }

              const rows = results.results.map(result => {
                const score = result.score.toFixed(3);
                const payload = JSON.stringify(result.payload, null, 2);
                const vector = result.vector ? result.vector.slice(0, 5).join(', ') + (result.vector.length > 5 ? '...' : '') : 'N/A';

                return \`
                  <tr>
                    <td>\${result.id}</td>
                    <td class="score-cell">\${score}</td>
                    <td class="payload-cell" title="\${payload}">\${payload}</td>
                    <td>\${vector}</td>
                  </tr>
                \`;
              }).join('');

              resultsBody.innerHTML = rows;
              resultsCount.textContent = \`\${results.results.length} results (\${results.totalFound} total, \${results.searchTime}ms)\`;
            }

            function displayError(error) {
              resultsBody.innerHTML = \`<tr><td colspan="4" class="error">\${error}</td></tr>\`;
              resultsCount.textContent = 'Error';
            }

            function updateConnectionStatus(connected, collection) {
              connectionStatus.textContent = connected ? 'Connected' : 'Disconnected';
              connectionStatus.className = connected ? 'status-connected' : 'status-disconnected';
              collectionInfo.textContent = collection ? \`Collection: \${collection}\` : '';
            }
          </script>
        </body>
      </html>
    `;
  }

  public dispose() {
    QdrantSearchPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
