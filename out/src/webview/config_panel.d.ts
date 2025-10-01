import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
/**
 * Webview panel for the Qdrant configuration interface.
 */
export declare class QdrantConfigPanel {
    static currentPanel: QdrantConfigPanel | undefined;
    private readonly _panel;
    private readonly _configService;
    private _disposables;
    private constructor();
    static createOrShow(extensionUri: vscode.Uri, configService: ConfigService): void;
    private _setupWebview;
    private _setupMessageHandling;
    private _handleLoadConfig;
    private _handleUpdateConfig;
    private _handleResetConfig;
    private _handleValidateConfig;
    private _getHtmlForWebview;
    dispose(): void;
}
//# sourceMappingURL=config_panel.d.ts.map