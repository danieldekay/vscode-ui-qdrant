import * as vscode from 'vscode';
import type { ConfigService } from '../services/config_service';
import type { SearchService } from '../services/search_service';
/**
 * Command handler for opening the Qdrant search interface.
 */
export declare function registerOpenSearchCommand(context: vscode.ExtensionContext, searchService: SearchService, configService: ConfigService): vscode.Disposable;
//# sourceMappingURL=open_search.d.ts.map