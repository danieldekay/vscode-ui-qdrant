"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_client_rest_1 = require("@qdrant/js-client-rest");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
// Integration test for vector search operations
// Tests upsert and search functionality with real vectors
(0, mocha_1.suite)('Vector Search Operations Integration', () => {
    let client;
    const testCollectionName = 'test-search-integration';
    (0, mocha_1.beforeEach)(async () => {
        client = new js_client_rest_1.QdrantClient({
            url: 'file:///tmp/qdrant-search-test.db',
        });
        // Clean up and create test collection
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
        });
        // Insert test data
        await client.upsert(testCollectionName, {
            wait: true,
            points: [
                {
                    id: 'doc-1',
                    vector: new Array(1536).fill(0.1),
                    payload: {
                        text: 'This is a test document about artificial intelligence',
                        category: 'tech',
                        score: 0.95,
                    },
                },
                {
                    id: 'doc-2',
                    vector: new Array(1536).fill(0.2),
                    payload: {
                        text: 'Machine learning is a subset of AI',
                        category: 'tech',
                        score: 0.87,
                    },
                },
                {
                    id: 'doc-3',
                    vector: new Array(1536).fill(0.3),
                    payload: {
                        text: 'Natural language processing helps computers understand text',
                        category: 'nlp',
                        score: 0.92,
                    },
                },
                {
                    id: 'doc-4',
                    vector: new Array(1536).fill(0.4),
                    payload: {
                        text: 'Vector databases store high-dimensional data efficiently',
                        category: 'database',
                        score: 0.88,
                    },
                },
            ],
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
    (0, mocha_1.suite)('Vector Upsert Operations', () => {
        (0, mocha_1.test)('should upsert single point successfully', async () => {
            const singlePoint = {
                id: 'single-test-point',
                vector: new Array(1536).fill(0.5),
                payload: {
                    text: 'Single test document',
                    category: 'test',
                },
            };
            await client.upsert(testCollectionName, {
                wait: true,
                points: [singlePoint],
            });
            // Verify point was added by searching for it
            const searchResult = await client.search(testCollectionName, {
                vector: new Array(1536).fill(0.5),
                limit: 1,
            });
            (0, chai_1.expect)(searchResult.length).to.be.greaterThan(0);
            (0, chai_1.expect)(searchResult[0].id).to.equal('single-test-point');
        });
        (0, mocha_1.test)('should upsert multiple points successfully', async () => {
            const multiplePoints = [
                {
                    id: 'batch-1',
                    vector: new Array(1536).fill(0.6),
                    payload: { text: 'Batch document 1' },
                },
                {
                    id: 'batch-2',
                    vector: new Array(1536).fill(0.7),
                    payload: { text: 'Batch document 2' },
                },
            ];
            await client.upsert(testCollectionName, {
                wait: true,
                points: multiplePoints,
            });
            // Verify collection has more points
            const collectionInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(collectionInfo.points_count).to.be.at.least(6); // 4 initial + 2 batch
        });
        (0, mocha_1.test)('should handle upsert with complex payload', async () => {
            const complexPoint = {
                id: 'complex-payload-point',
                vector: new Array(1536).fill(0.8),
                payload: {
                    title: 'Complex Document',
                    content: 'This document has multiple fields',
                    metadata: {
                        author: 'Test Author',
                        tags: ['test', 'complex', 'payload'],
                        published: new Date().toISOString(),
                        views: 42,
                    },
                    nested: {
                        level1: {
                            level2: 'deep nesting',
                        },
                    },
                },
            };
            await client.upsert(testCollectionName, {
                wait: true,
                points: [complexPoint],
            });
            // Search and verify payload
            const searchResult = await client.search(testCollectionName, {
                vector: new Array(1536).fill(0.8),
                limit: 1,
                with_payload: true,
            });
            (0, chai_1.expect)(searchResult[0].payload?.title).to.equal('Complex Document');
            (0, chai_1.expect)(searchResult[0].payload?.metadata?.author).to.equal('Test Author');
            (0, chai_1.expect)(searchResult[0].payload?.nested?.level1?.level2).to.equal('deep nesting');
        });
    });
    (0, mocha_1.suite)('Vector Search Operations', () => {
        (0, mocha_1.test)('should perform basic similarity search', async () => {
            const queryVector = new Array(1536).fill(0.15); // Similar to doc-1 (0.1)
            const searchResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 3,
            });
            (0, chai_1.expect)(searchResults).to.be.an('array');
            (0, chai_1.expect)(searchResults.length).to.be.at.most(3);
            searchResults.forEach((result) => {
                (0, chai_1.expect)(result).to.have.property('id');
                (0, chai_1.expect)(result).to.have.property('score');
                (0, chai_1.expect)(result.score).to.be.a('number');
                (0, chai_1.expect)(result.score).to.be.within(0, 1);
            });
        });
        (0, mocha_1.test)('should return results ordered by similarity', async () => {
            const queryVector = new Array(1536).fill(0.12); // Closest to doc-1 (0.1)
            const searchResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 4,
            });
            // Results should be ordered by decreasing similarity
            for (let i = 1; i < searchResults.length; i++) {
                (0, chai_1.expect)(searchResults[i - 1].score).to.be.at.least(searchResults[i].score);
            }
        });
        (0, mocha_1.test)('should respect limit parameter', async () => {
            const queryVector = new Array(1536).fill(0.25);
            const searchResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 2,
            });
            (0, chai_1.expect)(searchResults.length).to.equal(2);
        });
        (0, mocha_1.test)('should include payload when requested', async () => {
            const queryVector = new Array(1536).fill(0.18);
            const searchResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 2,
                with_payload: true,
            });
            searchResults.forEach((result) => {
                (0, chai_1.expect)(result).to.have.property('payload');
                (0, chai_1.expect)(result.payload).to.have.property('text');
                (0, chai_1.expect)(result.payload).to.have.property('category');
            });
        });
        (0, mocha_1.test)('should include vector when requested', async () => {
            const queryVector = new Array(1536).fill(0.22);
            const searchResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 1,
                with_vector: true,
            });
            (0, chai_1.expect)(searchResults[0]).to.have.property('vector');
            (0, chai_1.expect)(searchResults[0].vector).to.be.an('array');
            (0, chai_1.expect)(searchResults[0].vector?.length).to.equal(1536);
        });
        (0, mocha_1.test)('should handle score threshold filtering', async () => {
            const queryVector = new Array(1536).fill(0.19);
            const highThresholdResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 10,
                score_threshold: 0.8,
            });
            const lowThresholdResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 10,
                score_threshold: 0.1,
            });
            // Higher threshold should return fewer or equal results
            (0, chai_1.expect)(highThresholdResults.length).to.be.at.most(lowThresholdResults.length);
            // All results should meet threshold
            highThresholdResults.forEach((result) => {
                (0, chai_1.expect)(result.score).to.be.at.least(0.8);
            });
        });
    });
    (0, mocha_1.suite)('Search with Filtering', () => {
        (0, mocha_1.test)('should filter results by payload field', async () => {
            const queryVector = new Array(1536).fill(0.25);
            const filteredResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 10,
                filter: {
                    must: [
                        {
                            key: 'category',
                            match: { value: 'tech' },
                        },
                    ],
                },
                with_payload: true,
            });
            // All results should have category 'tech'
            filteredResults.forEach((result) => {
                (0, chai_1.expect)(result.payload?.category).to.equal('tech');
            });
        });
        (0, mocha_1.test)('should handle complex filter conditions', async () => {
            const queryVector = new Array(1536).fill(0.35);
            const complexFilteredResults = await client.search(testCollectionName, {
                vector: queryVector,
                limit: 10,
                filter: {
                    must: [
                        {
                            key: 'score',
                            range: { gte: 0.9 },
                        },
                    ],
                },
                with_payload: true,
            });
            // All results should have score >= 0.9
            complexFilteredResults.forEach((result) => {
                (0, chai_1.expect)(result.payload?.score).to.be.at.least(0.9);
            });
        });
    });
    (0, mocha_1.suite)('Delete Operations', () => {
        (0, mocha_1.test)('should delete points by IDs', async () => {
            // First verify points exist
            const collectionInfo = await client.getCollection(testCollectionName);
            const initialCount = collectionInfo.points_count || 0;
            // Delete specific points
            await client.delete(testCollectionName, {
                wait: true,
                points: ['doc-1', 'doc-2'],
            });
            // Verify points were deleted
            const updatedCollectionInfo = await client.getCollection(testCollectionName);
            (0, chai_1.expect)(updatedCollectionInfo.points_count).to.equal(initialCount - 2);
        });
        (0, mocha_1.test)('should handle deleting non-existent points gracefully', async () => {
            const initialCount = (await client.getCollection(testCollectionName)).points_count;
            // Try to delete non-existent points
            await client.delete(testCollectionName, {
                wait: true,
                points: ['non-existent-1', 'non-existent-2'],
            });
            // Count should remain the same
            const finalCount = (await client.getCollection(testCollectionName)).points_count;
            (0, chai_1.expect)(finalCount).to.equal(initialCount);
        });
    });
    (0, mocha_1.suite)('Error Conditions', () => {
        (0, mocha_1.test)('should handle search with invalid vector dimensions', async () => {
            const invalidVector = new Array(100).fill(0.1); // Wrong dimension
            try {
                await client.search(testCollectionName, {
                    vector: invalidVector,
                    limit: 1,
                });
                chai_1.expect.fail('Should have thrown an error for invalid vector dimensions');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.an('error');
            }
        });
        (0, mocha_1.test)('should handle search on non-existent collection', async () => {
            const queryVector = new Array(1536).fill(0.1);
            try {
                await client.search('non-existent-collection', {
                    vector: queryVector,
                    limit: 1,
                });
                chai_1.expect.fail('Should have thrown an error for non-existent collection');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.an('error');
            }
        });
    });
});
//# sourceMappingURL=test-search.integration.js.map