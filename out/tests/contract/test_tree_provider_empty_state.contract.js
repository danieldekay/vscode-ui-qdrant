"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
/**
 * Contract Tests: TreeDataProvider Empty State
 *
 * Tests defining the expected behavior of the TreeDataProvider
 * when no collections are available. The provider should display
 * a configuration access link instead of an empty tree.
 */
(0, mocha_1.describe)('TreeDataProvider Empty State - Contract Test', () => {
    let mockTreeDataProvider;
    let mockCollections;
    let mockConfigurationLink;
    (0, mocha_1.beforeEach)(() => {
        // Mock collections state - empty by default
        mockCollections = [];
        // Mock configuration link item
        mockConfigurationLink = {
            label: 'Configure Qdrant Database',
            tooltip: 'Click to configure the Qdrant database path',
            command: {
                command: 'qdrant.openConfig',
                title: 'Qdrant: Open Configuration',
            },
            iconPath: 'settings-gear',
            contextValue: 'configurationLink',
        };
        // Mock TreeDataProvider behavior
        mockTreeDataProvider = {
            getChildren: (element) => {
                if (element) {
                    // Child elements - not applicable for root level
                    return Promise.resolve([]);
                }
                // Root level - return configuration link when no collections
                if (mockCollections.length === 0) {
                    return Promise.resolve([mockConfigurationLink]);
                }
                // Return collections when available
                return Promise.resolve(mockCollections);
            },
            getTreeItem: (element) => {
                return element; // Return element as-is for TreeItem
            },
        };
    });
    (0, mocha_1.afterEach)(() => {
        mockCollections = [];
    });
    (0, mocha_1.it)('should return configuration link when collections array is empty', async () => {
        // Contract: When no collections are available, TreeDataProvider must return configuration link
        mockCollections = []; // Ensure empty state
        const children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1, 'Must return exactly one item when no collections');
        (0, chai_1.expect)(children[0]).to.equal(mockConfigurationLink, 'Must return configuration link item');
    });
    (0, mocha_1.it)('should return collections when collections are available', async () => {
        // Contract: When collections exist, TreeDataProvider must return collections, not configuration link
        const mockCollection1 = { label: 'collection1', vectorCount: 100 };
        const mockCollection2 = { label: 'collection2', vectorCount: 200 };
        mockCollections = [mockCollection1, mockCollection2];
        const children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(2, 'Must return all available collections');
        (0, chai_1.expect)(children).to.deep.equal(mockCollections, 'Must return the collections array');
        (0, chai_1.expect)(children).to.not.include(mockConfigurationLink, 'Must not include configuration link when collections exist');
    });
    (0, mocha_1.it)('should return empty array for child elements', async () => {
        // Contract: TreeDataProvider must not return children for any element (flat structure)
        const mockElement = { label: 'some-element' };
        const children = await mockTreeDataProvider.getChildren(mockElement);
        (0, chai_1.expect)(children).to.be.an('array').that.is.empty;
    });
    (0, mocha_1.it)('should provide configuration link with correct properties', () => {
        // Contract: Configuration link must have required TreeItem properties
        (0, chai_1.expect)(mockConfigurationLink).to.have.property('label', 'Configure Qdrant Database');
        (0, chai_1.expect)(mockConfigurationLink).to.have.property('tooltip').that.includes('configure');
        (0, chai_1.expect)(mockConfigurationLink).to.have.property('command');
        (0, chai_1.expect)(mockConfigurationLink.command).to.have.property('command', 'qdrant.openConfig');
        (0, chai_1.expect)(mockConfigurationLink.command).to.have.property('title', 'Qdrant: Open Configuration');
    });
    (0, mocha_1.it)('should mark configuration link with appropriate context value', () => {
        // Contract: Configuration link must have contextValue for UI customization
        (0, chai_1.expect)(mockConfigurationLink).to.have.property('contextValue', 'configurationLink');
    });
    (0, mocha_1.it)('should include appropriate icon for configuration link', () => {
        // Contract: Configuration link should have a settings-related icon
        (0, chai_1.expect)(mockConfigurationLink).to.have.property('iconPath').that.includes('settings');
    });
    (0, mocha_1.it)('should return TreeItem directly in getTreeItem', () => {
        // Contract: getTreeItem must return the element as TreeItem
        const testElement = { label: 'test' };
        const treeItem = mockTreeDataProvider.getTreeItem(testElement);
        (0, chai_1.expect)(treeItem).to.equal(testElement, 'Must return element directly as TreeItem');
    });
    (0, mocha_1.it)('should handle transition from empty to populated state', async () => {
        // Contract: TreeDataProvider must correctly transition between states
        // Start empty
        mockCollections = [];
        let children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.equal(mockConfigurationLink);
        // Add collections
        mockCollections = [{ label: 'new-collection' }];
        children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.equal(mockCollections[0]);
    });
    (0, mocha_1.it)('should maintain configuration link visibility when collections become empty again', async () => {
        // Contract: Configuration link must reappear when collections are cleared
        // Start with collections
        mockCollections = [{ label: 'collection' }];
        let children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.not.equal(mockConfigurationLink);
        // Clear collections
        mockCollections = [];
        children = await mockTreeDataProvider.getChildren();
        (0, chai_1.expect)(children).to.have.lengthOf(1);
        (0, chai_1.expect)(children[0]).to.equal(mockConfigurationLink);
    });
});
//# sourceMappingURL=test_tree_provider_empty_state.contract.js.map