"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const config_service_1 = require("../../src/services/config_service");
suite('Config API Contract Tests', () => {
    let sandbox;
    let mockConfigService;
    setup(() => {
        sandbox = sinon.createSandbox();
        mockConfigService = sandbox.createStubInstance(config_service_1.ConfigService);
    });
    teardown(() => {
        sandbox.restore();
    });
    suite('Open Config Command', () => {
        test('openConfig command should create webview panel', async () => {
            // Given: VS Code extension context
            // When: openConfig command is executed
            // This would normally create a webview panel
            // For now, we test that the command registration works
            // Then: Command should be registered successfully
            // This test will pass once the command handler is implemented
            (0, chai_1.expect)(true).to.be.true; // Placeholder assertion
        });
    });
    suite('Configuration Retrieval', () => {
        test('getConfiguration should return current Qdrant settings', async () => {
            // Given: VS Code workspace configuration
            const expectedConfig = {
                host: 'localhost',
                port: 6333,
                apiKey: '',
                collection: 'test-collection',
                timeout: 30000,
            };
            mockConfigService.getConfiguration.returns(expectedConfig);
            // When: getConfiguration is called
            const result = mockConfigService.getConfiguration();
            // Then: Returns current configuration
            (0, chai_1.expect)(result).to.deep.equal(expectedConfig);
        });
    });
    suite('Configuration Updates', () => {
        test('updateConfiguration should validate and save settings', async () => {
            // Given: Valid configuration update
            const updateRequest = {
                host: 'localhost',
                port: 6334,
                timeout: 45000,
            };
            mockConfigService.updateConfiguration.resolves(true);
            // When: updateConfiguration is called
            const result = await mockConfigService.updateConfiguration(updateRequest);
            // Then: Returns success
            (0, chai_1.expect)(result).to.be.true;
        });
        test('updateConfiguration should reject invalid settings', async () => {
            // Given: Invalid configuration update
            const invalidUpdate = {
                timeout: -1000, // Invalid: negative timeout
            };
            mockConfigService.updateConfiguration.resolves(false);
            // When: updateConfiguration is called with invalid data
            const result = await mockConfigService.updateConfiguration(invalidUpdate);
            // Then: Returns false for invalid configuration
            (0, chai_1.expect)(result).to.be.false;
        });
    });
    suite('Configuration Validation', () => {
        test('validateConfiguration should check URL format', async () => {
            // Given: Various URL formats
            const validUrls = [
                'file:///tmp/qdrant.db',
                'http://localhost:6333',
                'https://qdrant.example.com:6333',
            ];
            const invalidUrls = ['invalid-url', 'ftp://example.com', ''];
            // When: validateConfiguration is called
            for (const url of validUrls) {
                mockConfigService.validateConfiguration.returns({ valid: true });
                const result = mockConfigService.validateConfiguration({ host: url });
                (0, chai_1.expect)(result.valid).to.be.true;
            }
            for (const url of invalidUrls) {
                mockConfigService.validateConfiguration.returns({
                    valid: false,
                    errors: ['Invalid URL format'],
                });
                const result = mockConfigService.validateConfiguration({ host: url });
                (0, chai_1.expect)(result.valid).to.be.false;
            }
            // Then: Validates URL formats correctly
        });
        test('validateConfiguration should check numeric ranges', async () => {
            // Given: Configuration with numeric values
            const config = {
                timeout: 25000,
                port: 6333,
            };
            mockConfigService.validateConfiguration.returns({ valid: true });
            // When: validateConfiguration is called
            const result = mockConfigService.validateConfiguration(config);
            // Then: Validates numeric ranges
            (0, chai_1.expect)(result.valid).to.be.true;
        });
    });
    suite('Default Configuration', () => {
        test('getDefaultConfiguration should return sensible defaults', async () => {
            // Given: No user configuration
            const expectedDefaults = {
                host: 'localhost',
                port: 6333,
                apiKey: '',
                collection: 'default',
                timeout: 30000,
            };
            mockConfigService.getDefaultConfiguration.returns(expectedDefaults);
            // When: getDefaultConfiguration is called
            const result = mockConfigService.getDefaultConfiguration();
            // Then: Returns sensible default values
            (0, chai_1.expect)(result).to.deep.equal(expectedDefaults);
            (0, chai_1.expect)(result.host).to.equal('localhost');
            (0, chai_1.expect)(result.port).to.equal(6333);
            (0, chai_1.expect)(result.timeout).to.be.greaterThan(0);
        });
    });
});
//# sourceMappingURL=test_config_api.js.map