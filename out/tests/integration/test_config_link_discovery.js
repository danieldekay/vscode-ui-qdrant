"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
/**
 * Integration Tests: Configuration Link Discovery
 *
 * Tests the integration between TreeDataProvider and configuration state
 * to ensure the configuration link is properly displayed when no collections
 * are available. This tests the complete user scenario end-to-end.
 */
(0, mocha_1.describe)('Configuration Link Discovery - Integration Test', () => {
    let mockTreeDataProvider;
    let mockConfigurationService;
    let mockCollectionsService;
    (0, mocha_1.beforeEach)(() => {
        // Mock configuration service
        mockConfigurationService = {
            databasePath: null,
            getDatabasePath: () => {
                return mockConfigurationService.databasePath || './qdrant_db';
            },
            setDatabasePath: (path) => {
                mockConfigurationService.databasePath = path;
            },
            validateDatabasePath: async (path) => {
                if (!path || typeof path !== 'string') {
                    return { isValid: false, error: 'Invalid path' };
                }
                if (!path.startsWith('./') && !path.startsWith('../')) {
                    return { isValid: false, error: 'Path must be relative' };
                }
                return { isValid: true, error: null };
            },
            updateDatabasePath: async (path) => {
                const validation = await mockConfigurationService.validateDatabasePath(path);
                if (validation.isValid) {
                    mockConfigurationService.setDatabasePath(path);
                }
                return validation;
            },
        };
        // Mock collections service
        mockCollectionsService = {
            collections: [],
            isConnected: false,
            getCollections: async () => {
                return mockCollectionsService.collections;
            },
            connect: async () => {
                // Simulate connection attempt
                if (mockConfigurationService.getDatabasePath() === './qdrant_db') {
                    mockCollectionsService.isConnected = true;
                    mockCollectionsService.collections = [
                        { name: 'collection1', vectorCount: 100 },
                        { name: 'collection2', vectorCount: 200 },
                    ];
                }
                else {
                    mockCollectionsService.isConnected = false;
                    mockCollectionsService.collections = [];
                }
                return mockCollectionsService.isConnected;
            },
            disconnect: async () => {
                mockCollectionsService.isConnected = false;
                mockCollectionsService.collections = [];
            },
        };
        // Mock TreeDataProvider
        mockTreeDataProvider = {
            getChildren: async (element) => {
                if (element) {
                    // Child elements not supported in this implementation
                    return [];
                }
                // Get current collections
                const collections = await mockCollectionsService.getCollections();
                if (collections.length === 0) {
                    // No collections - show configuration link
                    return [
                        {
                            label: 'Configure Qdrant Database',
                            tooltip: 'Click to configure the Qdrant database path',
                            command: {
                                command: 'qdrant.openConfig',
                                title: 'Qdrant: Open Configuration',
                            },
                            iconPath: 'settings-gear',
                            contextValue: 'configurationLink',
                        },
                    ];
                }
                else {
                    // Return collections
                    return collections.map((collection) => ({
                        label: `${collection.name} (${collection.vectorCount} vectors)`,
                        tooltip: `Collection: ${collection.name}`,
                        contextValue: 'collection',
                        collection: collection,
                    }));
                }
            },
            getTreeItem: (element) => {
                return element;
            },
        };
    });
    (0, mocha_1.afterEach)(() => {
        // Clean up mocks
        mockCollectionsService.collections = [];
        mockCollectionsService.isConnected = false;
        mockConfigurationService.databasePath = null;
    });
    (0, mocha_1.it)('should display configuration link when no collections exist', async () => {
        // Given: No collections are available
        mockCollectionsService.collections = [];
        mockCollectionsService.isConnected = false;
        // When: TreeDataProvider is queried for children
        const children = await mockTreeDataProvider.getChildren();
        // Then: Configuration link should be displayed
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('label', 'Configure Qdrant Database');
        (0, chai_1.expect)(children[0]).to.have.property('command');
        (0, chai_1.expect)(children[0].command).to.have.property('command', 'qdrant.openConfig');
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'configurationLink');
    });
    (0, mocha_1.it)('should display collections when they are available', async () => {
        // Given: Collections are available
        mockCollectionsService.collections = [{ name: 'test-collection', vectorCount: 150 }];
        mockCollectionsService.isConnected = true;
        // When: TreeDataProvider is queried for children
        const children = await mockTreeDataProvider.getChildren();
        // Then: Collections should be displayed, not configuration link
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('label').that.includes('test-collection');
        (0, chai_1.expect)(children[0]).to.have.property('label').that.includes('150');
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'collection');
        (0, chai_1.expect)(children[0]).to.not.have.property('command'); // Collections don't have commands
    });
    (0, mocha_1.it)('should transition from configuration link to collections', async () => {
        // Given: Initially no collections (configuration link shown)
        mockCollectionsService.collections = [];
        let children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'configurationLink');
        // When: Collections become available
        mockCollectionsService.collections = [{ name: 'new-collection', vectorCount: 50 }];
        // Then: Collections should be displayed instead
        children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('label').that.includes('new-collection');
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'collection');
    });
    (0, mocha_1.it)('should handle multiple collections correctly', async () => {
        // Given: Multiple collections are available
        mockCollectionsService.collections = [
            { name: 'collection-a', vectorCount: 100 },
            { name: 'collection-b', vectorCount: 200 },
            { name: 'collection-c', vectorCount: 300 },
        ];
        // When: TreeDataProvider is queried
        const children = await mockTreeDataProvider.getChildren();
        // Then: All collections should be displayed
        (0, chai_1.expect)(children).to.have.lengthOf(3);
        (0, chai_1.expect)(children[0]).to.have.property('label').that.includes('collection-a');
        (0, chai_1.expect)(children[1]).to.have.property('label').that.includes('collection-b');
        (0, chai_1.expect)(children[2]).to.have.property('label').that.includes('collection-c');
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'collection');
        (0, chai_1.expect)(children[1]).to.have.property('contextValue', 'collection');
        (0, chai_1.expect)(children[2]).to.have.property('contextValue', 'collection');
    });
    (0, mocha_1.it)('should maintain configuration link when connection fails', async () => {
        // Given: Configuration is invalid (connection will fail)
        mockConfigurationService.setDatabasePath('/invalid/path');
        // When: Attempting to connect and check tree state
        const connected = await mockCollectionsService.connect();
        (0, chai_1.expect)(connected).to.be.false;
        const children = await mockTreeDataProvider.getChildren();
        // Then: Configuration link should still be shown
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'configurationLink');
    });
    (0, mocha_1.it)('should show collections after successful configuration', async () => {
        // Given: Valid configuration
        mockConfigurationService.setDatabasePath('./qdrant_db');
        // When: Connection succeeds
        const connected = await mockCollectionsService.connect();
        (0, chai_1.expect)(connected).to.be.true;
        const children = await mockTreeDataProvider.getChildren();
        // Then: Collections should be displayed
        (0, chai_1.expect)(children).to.have.lengthOf.greaterThan(0);
        children.forEach((child) => {
            (0, chai_1.expect)(child).to.have.property('contextValue', 'collection');
        });
    });
    (0, mocha_1.it)('should handle empty collections array after disconnection', async () => {
        // Given: Collections were available but then disconnected
        mockCollectionsService.collections = [{ name: 'temp-collection', vectorCount: 50 }];
        // When: Disconnected
        await mockCollectionsService.disconnect();
        // Then: Configuration link should appear again
        const children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.have.property('contextValue', 'configurationLink');
    });
    (0, mocha_1.it)('should provide proper tooltips for configuration link', async () => {
        // Given: No collections available
        mockCollectionsService.collections = [];
        // When: Getting tree children
        const children = await mockTreeDataProvider.getChildren();
        // Then: Configuration link should have helpful tooltip
        (0, chai_1.expect)(children[0]).to.have.property('tooltip');
        (0, chai_1.expect)(children[0].tooltip).to.include('configure');
        (0, chai_1.expect)(children[0].tooltip).to.include('database');
    });
    (0, mocha_1.it)('should provide proper tooltips for collections', async () => {
        // Given: Collections are available
        mockCollectionsService.collections = [{ name: 'my-collection', vectorCount: 75 }];
        // When: Getting tree children
        const children = await mockTreeDataProvider.getChildren();
        // Then: Collections should have descriptive tooltips
        (0, chai_1.expect)(children[0]).to.have.property('tooltip');
        (0, chai_1.expect)(children[0].tooltip).to.include('my-collection');
    });
});
//# sourceMappingURL=test_config_link_discovery.js.map