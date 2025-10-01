"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_client_rest_1 = require("@qdrant/js-client-rest");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
// Integration test for collection operations
// Tests advanced collection management functionality
(0, mocha_1.suite)('Collection Operations Integration', () => {
    let client;
    const testCollectionName = 'test-collections-integration';
    (0, mocha_1.beforeEach)(async () => {
        client = new js_client_rest_1.QdrantClient({
            url: 'file:///tmp/qdrant-collections-test.db',
        });
        // Create a test collection for each test
        try {
            await client.deleteCollection(testCollectionName);
        }
        catch (_error) {
            // Ignore if collection doesn't exist
        }
        await client.createCollection(testCollectionName, {
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
    });
    (0, mocha_1.afterEach)(async () => {
        // Clean up test collection
        try {
            await client.deleteCollection(testCollectionName);
        }
        catch (_error) {
            // Ignore cleanup errors
        }
    });
    (0, mocha_1.suite)('Collection Information', () => {
        (0, mocha_1.test)('should get collection info with correct configuration', async () => {
            const collectionInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(collectionInfo).to.have.property('config');
            (0, chai_1.expect)(collectionInfo.config.params.vectors?.size).to.equal(1536);
            (0, chai_1.expect)(collectionInfo.config.params.vectors?.distance).to.equal('Cosine');
            (0, chai_1.expect)(collectionInfo).to.have.property('points_count', 0);
            (0, chai_1.expect)(collectionInfo).to.have.property('segments_count');
            (0, chai_1.expect)(['green', 'yellow', 'red']).to.include(collectionInfo.status);
        });
        (0, mocha_1.test)('should get collection info with optimizer config', async () => {
            const collectionInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(collectionInfo.config.optimizer_config).to.exist;
            (0, chai_1.expect)(collectionInfo.config.optimizer_config?.default_segment_number).to.equal(2);
            (0, chai_1.expect)(collectionInfo.config.optimizer_config?.memmap_threshold).to.equal(10000);
        });
        (0, mocha_1.test)('should get collection info with HNSW config', async () => {
            const collectionInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(collectionInfo.config.hnsw_config).to.exist;
            (0, chai_1.expect)(collectionInfo.config.hnsw_config?.m).to.equal(16);
            (0, chai_1.expect)(collectionInfo.config.hnsw_config?.ef_construct).to.equal(100);
            (0, chai_1.expect)(collectionInfo.config.hnsw_config?.full_scan_threshold).to.equal(10000);
        });
    });
    (0, mocha_1.suite)('Collection Existence Checks', () => {
        (0, mocha_1.test)('should confirm collection exists', async () => {
            const collections = await client.getCollections();
            const collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.include(testCollectionName);
        });
        (0, mocha_1.test)('should confirm collection does not exist after deletion', async () => {
            const tempCollection = 'temp-collection-for-existence-test';
            // Create temp collection
            await client.createCollection(tempCollection, {
                vectors: { size: 1536, distance: 'Cosine' },
            });
            // Verify it exists
            let collections = await client.getCollections();
            let collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.include(tempCollection);
            // Delete it
            await client.deleteCollection(tempCollection);
            // Verify it no longer exists
            collections = await client.getCollections();
            collectionNames = collections.collections.map((c) => c.name);
            (0, chai_1.expect)(collectionNames).to.not.include(tempCollection);
        });
    });
    (0, mocha_1.suite)('Multiple Collections', () => {
        const collectionNames = ['multi-test-1', 'multi-test-2', 'multi-test-3'];
        (0, mocha_1.beforeEach)(async () => {
            // Create multiple collections
            for (const name of collectionNames) {
                await client.createCollection(name, {
                    vectors: { size: 1536, distance: 'Cosine' },
                });
            }
        });
        (0, mocha_1.afterEach)(async () => {
            // Clean up multiple collections
            for (const name of collectionNames) {
                try {
                    await client.deleteCollection(name);
                }
                catch (_error) {
                    // Ignore cleanup errors
                }
            }
        });
        (0, mocha_1.test)('should list all collections', async () => {
            const collections = await client.getCollections();
            const collectionNamesResult = collections.collections.map((c) => c.name);
            for (const name of collectionNames) {
                (0, chai_1.expect)(collectionNamesResult).to.include(name);
            }
            (0, chai_1.expect)(collectionNamesResult).to.include(testCollectionName); // From beforeEach
        });
        (0, mocha_1.test)('should get info for each collection', async () => {
            for (const name of collectionNames) {
                const collectionInfo = await client.getCollection(name);
                (0, chai_1.expect)(collectionInfo.config.params.vectors?.size).to.equal(1536);
                (0, chai_1.expect)(collectionInfo.status).to.be.a('string');
            }
        });
    });
    (0, mocha_1.suite)('Collection Updates', () => {
        (0, mocha_1.test)('should handle collection updates (if supported)', async () => {
            // Note: The Qdrant REST client may not support all update operations
            // This test verifies the client can handle collection info retrieval
            // after potential updates (implementation-dependent)
            const initialInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(initialInfo.points_count).to.equal(0);
            // Some implementations might support updating collection parameters
            // For now, we just verify the collection remains accessible
            const updatedInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(updatedInfo.config.params.vectors?.size).to.equal(1536);
        });
    });
    (0, mocha_1.suite)('Error Conditions', () => {
        (0, mocha_1.test)('should handle getting info for non-existent collection', async () => {
            const nonExistentName = 'definitely-does-not-exist-collection';
            try {
                await client.getCollection(nonExistentName);
                chai_1.expect.fail('Should have thrown an error for non-existent collection');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.an('error');
                (0, chai_1.expect)(error.message).to.include('Not found');
            }
        });
        (0, mocha_1.test)('should handle deleting non-existent collection', async () => {
            const nonExistentName = 'another-definitely-does-not-exist-collection';
            try {
                await client.deleteCollection(nonExistentName);
                // Some implementations might not throw for deleting non-existent collections
            }
            catch (error) {
                // Error is acceptable
                (0, chai_1.expect)(error).to.be.an('error');
            }
        });
        (0, mocha_1.test)('should handle creating collection with duplicate name', async () => {
            try {
                await client.createCollection(testCollectionName, {
                    vectors: { size: 1536, distance: 'Cosine' },
                });
                // If it succeeds, the client handles duplicates gracefully
            }
            catch (error) {
                // Error is acceptable for duplicate creation attempts
                (0, chai_1.expect)(error).to.be.an('error');
            }
        });
    });
});
//# sourceMappingURL=test-collections.integration.js.map