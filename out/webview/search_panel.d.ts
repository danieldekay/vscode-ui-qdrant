import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
import type { SearchService } from '../services/search_service';
/**
 * Webview panel for the Qdrant search interface.
 */
export declare class QdrantSearchPanel {
    static currentPanel: QdrantSearchPanel | undefined;
    private readonly _panel;
    private readonly _searchService;
    private readonly _configService;
    private _disposables;
    private constructor();
    static createOrShow(extensionUri: vscode.Uri, searchService: SearchService, configService: ConfigService): void;
    private _setupWebview;
    private _setupMessageHandling;
    private _handleSearch;
    private _handleUpdateParameters;
    private _handleGetConnectionStatus;
    private _getHtmlForWebview;
    dispose(): void;
}
//# sourceMappingURL=search_panel.d.ts.map