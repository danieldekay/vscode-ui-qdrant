import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';

/**
 * Webview panel for the Qdrant configuration interface.
 */
export class QdrantConfigPanel {
  public static currentPanel: QdrantConfigPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _configService: ConfigService;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    _extensionUri: vscode.Uri,
    configService: ConfigService,
  ) {
    this._panel = panel;
    this._configService = configService;

    this._setupWebview();
    this._setupMessageHandling();
  }

  public static createOrShow(extensionUri: vscode.Uri, configService: ConfigService) {
    const column = vscode.ViewColumn.One;

    if (QdrantConfigPanel.currentPanel) {
      QdrantConfigPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel('qdrantConfig', 'Qdrant Configuration', column, {
      enableScripts: true,
      localResourceRoots: [extensionUri],
      retainContextWhenHidden: true,
    });

    QdrantConfigPanel.currentPanel = new QdrantConfigPanel(panel, extensionUri, configService);
  }

  private _setupWebview() {
    this._panel.webview.html = this._getHtmlForWebview();

    this._panel.onDidDispose(
      () => {
        QdrantConfigPanel.currentPanel = undefined;
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
          case 'loadConfig':
            await this._handleLoadConfig();
            break;
          case 'updateConfig':
            await this._handleUpdateConfig(message.config);
            break;
          case 'resetConfig':
            await this._handleResetConfig();
            break;
          case 'validateConfig':
            await this._handleValidateConfig(message.config);
            break;
          case 'autoDiscover':
            await this._handleAutoDiscover();
            break;
          default:
            console.warn('Unknown message type:', message.type);
        }
      },
      undefined,
      this._disposables,
    );
  }

  private async _handleLoadConfig() {
    try {
      const config = this._configService.getConfiguration();
      const defaultParams = this._configService.getDefaultSearchParameters();

      this._panel.webview.postMessage({
        type: 'configLoaded',
        config: {
          ...config,
          defaultParameters: defaultParams,
        },
      });
    } catch (error) {
      this._panel.webview.postMessage({
        type: 'configError',
        error: error instanceof Error ? error.message : 'Failed to load configuration',
      });
    }
  }

  private async _handleUpdateConfig(config: any) {
    try {
      const success = await this._configService.updateConfiguration(config);

      if (success) {
        this._panel.webview.postMessage({
          type: 'configUpdated',
          success: true,
        });
      } else {
        this._panel.webview.postMessage({
          type: 'configUpdated',
          success: false,
          error: 'Configuration validation failed',
        });
      }
    } catch (error) {
      this._panel.webview.postMessage({
        type: 'configUpdated',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update configuration',
      });
    }
  }

  private async _handleResetConfig() {
    try {
      await this._configService.resetToDefaults();

      this._panel.webview.postMessage({
        type: 'configReset',
        success: true,
      });
    } catch (error) {
      this._panel.webview.postMessage({
        type: 'configReset',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset configuration',
      });
    }
  }

  private async _handleValidateConfig(config: any) {
    const validation = this._configService.validateConfiguration(config);

    this._panel.webview.postMessage({
      type: 'configValidated',
      valid: validation.valid,
      errors: validation.errors,
    });
  }

  private async _handleAutoDiscover() {
    try {
      // Execute the enhanced select local database file command
      await vscode.commands.executeCommand('qdrant.selectLocalDbFileEnhanced');

      // After successful auto-discovery, reload the configuration to update the form field
      await this._handleLoadConfig();

      this._panel.webview.postMessage({
        type: 'autoDiscoverCompleted',
        success: true,
      });
    } catch (error) {
      this._panel.webview.postMessage({
        type: 'autoDiscoverCompleted',
        success: false,
        error: error instanceof Error ? error.message : 'Auto-discovery failed',
      });
    }
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
          <title>Qdrant Configuration</title>
          <style>
            body {
              font-family: var(--vscode-font-family);
              font-size: var(--vscode-font-size);
              background-color: var(--vscode-editor-background);
              color: var(--vscode-editor-foreground);
              margin: 0;
              padding: 20px;
              height: 100vh;
              overflow: auto;
            }

            .config-container {
              max-width: 800px;
              margin: 0 auto;
            }

            .config-section {
              margin-bottom: 30px;
              padding: 20px;
              background-color: var(--vscode-editorWidget-background);
              border: 1px solid var(--vscode-editorWidget-border);
              border-radius: 3px;
            }

            .section-title {
              font-size: 1.2em;
              font-weight: 600;
              margin-bottom: 15px;
              color: var(--vscode-textLink-foreground);
            }

            .form-group {
              margin-bottom: 15px;
            }

            .form-row {
              display: flex;
              gap: 15px;
              align-items: end;
            }

            .form-label {
              display: block;
              font-weight: 600;
              margin-bottom: 5px;
            }

            .form-input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--vscode-input-border);
              background-color: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border-radius: 3px;
              font-family: inherit;
            }

            .form-input:focus {
              outline: 1px solid var(--vscode-focusBorder);
            }

            .form-checkbox {
              margin-right: 8px;
            }

            .form-help {
              font-size: 0.9em;
              color: var(--vscode-descriptionForeground);
              margin-top: 3px;
            }

            .button-group {
              display: flex;
              gap: 10px;
              margin-top: 20px;
            }

            .btn {
              padding: 8px 16px;
              border: none;
              border-radius: 3px;
              cursor: pointer;
              font-family: inherit;
              font-size: 0.9em;
            }

            .btn-primary {
              background-color: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
            }

            .btn-primary:hover {
              background-color: var(--vscode-button-hoverBackground);
            }

            .btn-secondary {
              background-color: var(--vscode-button-secondaryBackground);
              color: var(--vscode-button-secondaryForeground);
            }

            .btn-secondary:hover {
              background-color: var(--vscode-button-secondaryHoverBackground);
            }

            .btn-danger {
              background-color: var(--vscode-errorForeground);
              color: var(--vscode-button-background);
            }

            .btn-danger:hover {
              background-color: var(--vscode-errorForeground);
              opacity: 0.8;
            }

            .status-message {
              margin-top: 10px;
              padding: 8px 12px;
              border-radius: 3px;
              font-size: 0.9em;
            }

            .status-success {
              background-color: var(--vscode-notificationsInfoIcon-foreground);
              color: var(--vscode-button-background);
            }

            .status-info {
              background-color: var(--vscode-notificationsInfoIcon-foreground);
              color: var(--vscode-button-background);
              opacity: 0.8;
            }

            .status-error {
              background-color: var(--vscode-inputValidation-errorBackground);
              color: var(--vscode-inputValidation-errorForeground);
              border: 1px solid var(--vscode-inputValidation-errorBorder);
            }

            .validation-errors {
              margin-top: 10px;
            }

            .validation-error {
              color: var(--vscode-inputValidation-errorForeground);
              font-size: 0.9em;
              margin-bottom: 3px;
            }

            .loading {
              text-align: center;
              padding: 20px;
              color: var(--vscode-descriptionForeground);
            }
          </style>
        </head>
        <body>
          <div class="config-container">
            <h1>Qdrant Configuration</h1>

            <div class="config-section">
              <div class="section-title">Connection Settings</div>

              <div class="form-group">
                <label class="form-label" for="connection-url">Server URL</label>
                <input type="text" class="form-input" id="connection-url" placeholder="http://localhost:6333 or file:///path/to/db" />
                <div class="form-help">Use 'http://' or 'https://' for server mode, 'file://' for local file mode</div>
              </div>

              <div class="form-row">
                <div class="form-group" style="flex: 1;">
                  <label class="form-label" for="connection-port">Port</label>
                  <input type="number" class="form-input" id="connection-port" placeholder="6333" min="1" max="65535" />
                </div>

                <div class="form-group" style="flex: 2;">
                  <label class="form-label" for="api-key">API Key</label>
                  <input type="password" class="form-input" id="api-key" placeholder="Optional API key" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="timeout">Timeout (ms)</label>
                <input type="number" class="form-input" id="timeout" placeholder="30000" min="1000" max="300000" />
              </div>
            </div>

            <div class="config-section">
              <div class="section-title">Collection Settings</div>

              <div class="form-group">
                <label class="form-label" for="default-collection">Default Collection</label>
                <input type="text" class="form-input" id="default-collection" placeholder="my-collection" />
                <div class="form-help">Default collection to search when no collection is specified</div>
              </div>
            </div>

            <div class="config-section">
              <div class="section-title">Search Defaults</div>

              <div class="form-row">
                <div class="form-group" style="flex: 1;">
                  <label class="form-label" for="default-limit">Result Limit</label>
                  <input type="number" class="form-input" id="default-limit" placeholder="10" min="1" max="1000" />
                </div>

                <div class="form-group" style="flex: 1;">
                  <label class="form-label" for="default-threshold">Similarity Threshold</label>
                  <input type="number" class="form-input" id="default-threshold" placeholder="0.7" min="0" max="1" step="0.1" />
                </div>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" id="default-include-payload" class="form-checkbox" checked />
                  Include payload data by default
                </label>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" id="default-include-vector" class="form-checkbox" />
                  Include vector data by default
                </label>
              </div>
            </div>

            <div class="button-group">
              <button class="btn btn-primary" id="save-btn">Save Configuration</button>
              <button class="btn btn-secondary" id="validate-btn">Validate</button>
              <button class="btn btn-secondary" id="autodiscover-btn">🔍 Auto-Discover Database</button>
              <button class="btn btn-danger" id="reset-btn">Reset to Defaults</button>
            </div>

            <div id="status-message"></div>
            <div id="validation-errors" class="validation-errors" style="display: none;"></div>
          </div>

          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();

            // DOM elements
            const connectionUrl = document.getElementById('connection-url');
            const connectionPort = document.getElementById('connection-port');
            const apiKey = document.getElementById('api-key');
            const timeout = document.getElementById('timeout');
            const defaultCollection = document.getElementById('default-collection');
            const defaultLimit = document.getElementById('default-limit');
            const defaultThreshold = document.getElementById('default-threshold');
            const defaultIncludePayload = document.getElementById('default-include-payload');
            const defaultIncludeVector = document.getElementById('default-include-vector');
            const saveBtn = document.getElementById('save-btn');
            const validateBtn = document.getElementById('validate-btn');
            const autodiscoverBtn = document.getElementById('autodiscover-btn');
            const resetBtn = document.getElementById('reset-btn');
            const statusMessage = document.getElementById('status-message');
            const validationErrors = document.getElementById('validation-errors');

            // Initialize
            loadConfiguration();

            // Event listeners
            saveBtn.addEventListener('click', saveConfiguration);
            validateBtn.addEventListener('click', validateConfiguration);
            autodiscoverBtn.addEventListener('click', autoDiscoverDatabase);
            resetBtn.addEventListener('click', resetConfiguration);

            // Functions
            function loadConfiguration() {
              vscode.postMessage({ type: 'loadConfig' });
            }

            function saveConfiguration() {
              const config = {
                url: connectionUrl.value.trim(),
                port: connectionPort.value ? parseInt(connectionPort.value) : undefined,
                apiKey: apiKey.value || undefined,
                timeout: timeout.value ? parseInt(timeout.value) : undefined,
                collection: defaultCollection.value.trim() || undefined
              };

              const searchParams = {
                resultLimit: defaultLimit.value ? parseInt(defaultLimit.value) : undefined,
                similarityThreshold: defaultThreshold.value ? parseFloat(defaultThreshold.value) : undefined,
                includePayload: defaultIncludePayload.checked,
                includeVector: defaultIncludeVector.checked
              };

              // Save both connection config and search defaults
              vscode.postMessage({
                type: 'updateConfig',
                config: { ...config, ...searchParams }
              });
            }

            function validateConfiguration() {
              const config = {
                url: connectionUrl.value.trim(),
                port: connectionPort.value ? parseInt(connectionPort.value) : undefined,
                apiKey: apiKey.value || undefined,
                timeout: timeout.value ? parseInt(timeout.value) : undefined,
                collection: defaultCollection.value.trim() || undefined
              };

              vscode.postMessage({
                type: 'validateConfig',
                config
              });
            }

            function resetConfiguration() {
              if (confirm('Are you sure you want to reset all configuration to defaults?')) {
                vscode.postMessage({ type: 'resetConfig' });
              }
            }

            function autoDiscoverDatabase() {
              showStatus('Starting auto-discovery...', 'info');
              vscode.postMessage({ type: 'autoDiscover' });
            }

            function showStatus(message, type = 'success') {
              statusMessage.className = \`status-message status-\${type}\`;
              statusMessage.textContent = message;
              statusMessage.style.display = 'block';

              setTimeout(() => {
                statusMessage.style.display = 'none';
              }, 5000);
            }

            function showValidationErrors(errors) {
              if (errors && errors.length > 0) {
                validationErrors.innerHTML = errors.map(error => \`<div class="validation-error">• \${error}</div>\`).join('');
                validationErrors.style.display = 'block';
              } else {
                validationErrors.style.display = 'none';
              }
            }

            // Message handling
            window.addEventListener('message', event => {
              const message = event.data;

              switch (message.type) {
                case 'configLoaded':
                  populateForm(message.config);
                  break;

                case 'configUpdated':
                  if (message.success) {
                    showStatus('Configuration saved successfully');
                    loadConfiguration(); // Reload to get updated values
                  } else {
                    showStatus(message.error || 'Failed to save configuration', 'error');
                  }
                  break;

                case 'configReset':
                  if (message.success) {
                    showStatus('Configuration reset to defaults');
                    loadConfiguration();
                  } else {
                    showStatus(message.error || 'Failed to reset configuration', 'error');
                  }
                  break;

                case 'configValidated':
                  if (message.valid) {
                    showStatus('Configuration is valid');
                    showValidationErrors([]);
                  } else {
                    showStatus('Configuration has errors', 'error');
                    showValidationErrors(message.errors);
                  }
                  break;

                case 'autoDiscoverCompleted':
                  if (message.success) {
                    showStatus('Auto-discovery completed! Check your workspace settings for the updated database path.');
                    loadConfiguration(); // Reload to show updated configuration
                  } else {
                    showStatus(message.error || 'Auto-discovery failed', 'error');
                  }
                  break;

                case 'configError':
                  showStatus(message.error, 'error');
                  break;
              }
            });

            function populateForm(config) {
              connectionUrl.value = config.databasePath || config.url || '';
              connectionPort.value = config.port || '';
              apiKey.value = config.apiKey || '';
              timeout.value = config.timeout || '';
              defaultCollection.value = config.collection || '';

              if (config.defaultParameters) {
                defaultLimit.value = config.defaultParameters.resultLimit || '';
                defaultThreshold.value = config.defaultParameters.similarityThreshold || '';
                defaultIncludePayload.checked = config.defaultParameters.includePayload;
                defaultIncludeVector.checked = config.defaultParameters.includeVector;
              }
            }
          </script>
        </body>
      </html>
    `;
  }

  public dispose() {
    QdrantConfigPanel.currentPanel = undefined;

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
