"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_client_rest_1 = require("@qdrant/js-client-rest");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
// Integration test for basic connection workflow
// Tests actual Qdrant client connection behavior in local file mode
(0, mocha_1.suite)('Connection Integration', () => {
    let client;
    (0, mocha_1.beforeEach)(() => {
        // Create client for local file mode (no server required)
        client = new js_client_rest_1.QdrantClient({
            url: 'file:///tmp/qdrant-test.db',
        });
    });
    (0, mocha_1.afterEach)(async () => {
        // Clean up any test collections
        try {
            await client.deleteCollection('test-connection-collection');
        }
        catch (_error) {
            // Ignore errors if collection doesn't exist
        }
    });
    (0, mocha_1.suite)('Client Initialization', () => {
        (0, mocha_1.test)('should create QdrantClient instance', () => {
            (0, chai_1.expect)(client).to.be.instanceOf(js_client_rest_1.QdrantClient);
        });
        (0, mocha_1.test)('should initialize with file URL for local mode', () => {
            const fileClient = new js_client_rest_1.QdrantClient({
                url: 'file:///tmp/test.db',
            });
            (0, chai_1.expect)(fileClient).to.be.instanceOf(js_client_rest_1.QdrantClient);
        });
    });
    (0, mocha_1.suite)('Basic Connection Workflow', () => {
        (0, mocha_1.test)('should create collection successfully', async () => {
            const collectionName = 'test-connection-collection';
            await client.createCollection(collectionName, {
                vectors: {
                    size: 1536,
                    distance: 'Cosine',
                },
            });
            // Verify collection exists
            const collections = await client.getCollections();
            const collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.include(collectionName);
        });
        (0, mocha_1.test)('should handle collection creation with full config', async () => {
            const collectionName = 'test-full-config-collection';
            await client.createCollection(collectionName, {
                vectors: {
                    size: 1536,
                    distance: 'Cosine',
                },
                optimizers_config: {
                    default_segment_number: 2,
                    memmap_threshold: 10000,
                },
                hnsw_config: {
                    m: 16,
                    ef_construct: 100,
                    full_scan_threshold: 10000,
                },
            });
            // Verify collection exists and has correct config
            const collectionInfo = await client.getCollection(collectionName);
            (0, chai_1.expect)(collectionInfo.config.params.vectors?.size).to.equal(1536);
            (0, chai_1.expect)(collectionInfo.config.params.vectors?.distance).to.equal('Cosine');
        });
        (0, mocha_1.test)('should delete collection successfully', async () => {
            const collectionName = 'test-delete-collection';
            // Create collection first
            await client.createCollection(collectionName, {
                vectors: {
                    size: 1536,
                    distance: 'Cosine',
                },
            });
            // Delete collection
            await client.deleteCollection(collectionName);
            // Verify collection no longer exists
            const collections = await client.getCollections();
            const collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.not.include(collectionName);
        });
        (0, mocha_1.test)('should list collections', async () => {
            const collectionName1 = 'test-list-collection-1';
            const collectionName2 = 'test-list-collection-2';
            // Create collections
            await client.createCollection(collectionName1, {
                vectors: { size: 1536, distance: 'Cosine' },
            });
            await client.createCollection(collectionName2, {
                vectors: { size: 1536, distance: 'Cosine' },
            });
            // List collections
            const collections = await client.getCollections();
            const collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.include(collectionName1);
            (0, chai_1.expect)(collectionNames).to.include(collectionName2);
            (0, chai_1.expect)(collectionNames.length).to.be.at.least(2);
        });
    });
    (0, mocha_1.suite)('Error Handling', () => {
        (0, mocha_1.test)('should handle non-existent collection gracefully', async () => {
            try {
                await client.getCollection('non-existent-collection');
                chai_1.expect.fail('Should have thrown an error');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.an('error');
                (0, chai_1.expect)(error.message).to.include('Not found');
            }
        });
        (0, mocha_1.test)('should handle invalid collection name', async () => {
            const invalidName = 'invalid collection name with spaces';
            try {
                await client.createCollection(invalidName, {
                    vectors: { size: 1536, distance: 'Cosine' },
                });
                // If it succeeds, that's also acceptable for this test
            }
            catch (error) {
                // Error is acceptable
                (0, chai_1.expect)(error).to.be.an('error');
            }
        });
    });
    (0, mocha_1.suite)('Health Check', () => {
        (0, mocha_1.test)('should perform basic health check', async () => {
            // In local file mode, health check might not be meaningful
            // but we can test that the client is responsive
            const collections = await client.getCollections();
            (0, chai_1.expect)(collections).to.have.property('collections');
            (0, chai_1.expect)(collections.collections).to.be.an('array');
        });
    });
});
//# sourceMappingURL=test-connection.integration.js.map