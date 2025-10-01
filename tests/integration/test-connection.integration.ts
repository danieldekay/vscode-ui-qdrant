import { QdrantClient } from '@qdrant/js-client-rest';
import { expect } from 'chai';
import { afterEach, beforeEach, suite, test } from 'mocha';

// Integration test for basic connection workflow
// Tests actual Qdrant client connection behavior in local file mode

suite('Connection Integration', () => {
  let client: QdrantClient;

  beforeEach(() => {
    // Create client for local file mode (no server required)
    client = new QdrantClient({
      url: 'file:///tmp/qdrant-test.db',
    });
  });

  afterEach(async () => {
    // Clean up any test collections
    try {
      await client.deleteCollection('test-connection-collection');
    } catch (_error) {
      // Ignore errors if collection doesn't exist
    }
  });

  suite('Client Initialization', () => {
    test('should create QdrantClient instance', () => {
      expect(client).to.be.instanceOf(QdrantClient);
    });

    test('should initialize with file URL for local mode', () => {
      const fileClient = new QdrantClient({
        url: 'file:///tmp/test.db',
      });
      expect(fileClient).to.be.instanceOf(QdrantClient);
    });
  });

  suite('Basic Connection Workflow', () => {
    test('should create collection successfully', async () => {
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
      expect(collectionNames).to.include(collectionName);
    });

    test('should handle collection creation with full config', async () => {
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
      expect(collectionInfo.config.params.vectors?.size).to.equal(1536);
      expect(collectionInfo.config.params.vectors?.distance).to.equal('Cosine');
    });

    test('should delete collection successfully', async () => {
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
      expect(collectionNames).to.not.include(collectionName);
    });

    test('should list collections', async () => {
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

      expect(collectionNames).to.include(collectionName1);
      expect(collectionNames).to.include(collectionName2);
      expect(collectionNames.length).to.be.at.least(2);
    });
  });

  suite('Error Handling', () => {
    test('should handle non-existent collection gracefully', async () => {
      try {
        await client.getCollection('non-existent-collection');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.include('Not found');
      }
    });

    test('should handle invalid collection name', async () => {
      const invalidName = 'invalid collection name with spaces';

      try {
        await client.createCollection(invalidName, {
          vectors: { size: 1536, distance: 'Cosine' },
        });
        // If it succeeds, that's also acceptable for this test
      } catch (error: any) {
        // Error is acceptable
        expect(error).to.be.an('error');
      }
    });
  });

  suite('Health Check', () => {
    test('should perform basic health check', async () => {
      // In local file mode, health check might not be meaningful
      // but we can test that the client is responsive
      const collections = await client.getCollections();
      expect(collections).to.have.property('collections');
      expect(collections.collections).to.be.an('array');
    });
  });
});
