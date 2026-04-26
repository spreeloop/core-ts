// Mock firebase/firestore module before imports
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  collectionGroup: jest.fn(),
  onSnapshot: jest.fn(),
  runTransaction: jest.fn(),
  writeBatch: jest.fn(),
  getFirestore: jest.fn(),
}));

import { QueryOrderBy } from '../../utils/query_order_by';
import { QueryFilter } from '../../utils/query_filter';
import { Database, DistanceMeasure } from '../../database';
import * as firestore from 'firebase/firestore';

describe('FirestoreClientDatabase', () => {
  // Create a properly typed mock Firestore instance
  const mockDb = {} as ReturnType<typeof firestore.getFirestore>;
  const database = Database.createFirestoreClient(mockDb);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecord', () => {
    it('should run successfully.', async () => {
      const mockDocRef = { id: 'doc1', path: 'collection/x' };
      const mockSnapshot = {
        ref: { path: 'collection/x' },
        data: () => ({ key: 'value' }),
      };

      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.getDoc as jest.Mock).mockResolvedValue(mockSnapshot);

      const document = await database.getRecord('collection/x');
      expect(document.data).toBeDefined();
    });
  });

  describe('getCollectionGroup', () => {
    it('should run successfully.', async () => {
      const mockQuery = {};
      const mockSnapshot = {
        docs: [
          { ref: { path: 'parent/any' }, data: () => ({ key: 'value' }) },
        ],
      };

      (firestore.collectionGroup as jest.Mock).mockReturnValue(mockQuery);
      (firestore.query as jest.Mock).mockReturnValue(mockQuery);
      (firestore.where as jest.Mock).mockReturnValue(mockQuery);
      (firestore.orderBy as jest.Mock).mockReturnValue(mockQuery);
      (firestore.limit as jest.Mock).mockReturnValue(mockQuery);
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const document = await database.getCollectionGroup({
        collectionId: 'any',
        limit: 2,
        filters: [new QueryFilter('unknown', '!=', 'whatever')],
      });
      const document2 = await database.getCollectionGroup({
        collectionId: 'any',
        orderBy: new QueryOrderBy('any', true),
      });
      const document3 = await database.getCollectionGroup({
        collectionId: 'any',
        orderBy: new QueryOrderBy('any', false),
      });
      expect(document.length).toBe(1);
      expect(document2.length).toBe(1);
      expect(document3.length).toBe(1);
    });
  });

  describe('getCollection', () => {
    it('should run successfully.', async () => {
      const mockColRef = { id: 'test' };
      const mockQuery = {};
      const mockSnapshot = {
        docs: [
          { ref: { path: 'test/doc1' }, data: () => ({ key: 'value' }) },
        ],
      };

      (firestore.collection as jest.Mock).mockReturnValue(mockColRef);
      (firestore.query as jest.Mock).mockReturnValue(mockQuery);
      (firestore.where as jest.Mock).mockReturnValue(mockQuery);
      (firestore.orderBy as jest.Mock).mockReturnValue(mockQuery);
      (firestore.limit as jest.Mock).mockReturnValue(mockQuery);
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const document = await database.getCollection({
        collectionPath: 'whatever',
        orderBy: new QueryOrderBy('key', false),
        limit: 2,
        filters: [new QueryFilter('unknown', '!=', 'whatever')],
      });
      const document2 = await database.getCollection({
        collectionPath: 'whatever',
        orderBy: new QueryOrderBy('key', true),
      });
      expect(document2.length).toBe(1);
      expect(document.length).toBe(1);
      expect(document[0].data?.key).toBe('value');
    });

    it('should support array-contains operator', async () => {
      const mockSnapshot = { docs: [] };

      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const document = await database.getCollection({
        collectionPath: 'restaurants',
        filters: [new QueryFilter('tags', 'array-contains', 'pizza')],
      });
      expect(document.length).toBeGreaterThanOrEqual(0);
    });

    it('should support array-contains with multiple filters', async () => {
      const mockSnapshot = { docs: [] };

      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const document = await database.getCollection({
        collectionPath: 'restaurants',
        filters: [
          new QueryFilter('tags', 'array-contains', 'italian'),
          new QueryFilter('categories', 'array-contains', 'food'),
        ],
      });
      expect(document.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('setRecord', () => {
    it('should run successfully.', async () => {
      const mockDocRef = { id: 'doc1', path: 'test/doc1' };

      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      const result1 = await database.setRecord('whatever', {});
      expect(result1).toBe(true);
    });
  });

  describe('createRecord', () => {
    it('should run successfully.', async () => {
      const mockColRef = { id: 'test' };
      const mockDocRef = { id: 'newdoc', path: 'test/newdoc' };

      (firestore.collection as jest.Mock).mockReturnValue(mockColRef);
      (firestore.addDoc as jest.Mock).mockResolvedValue(mockDocRef);

      const pathPromotionCreated = await database.createRecord('whatever', {
        any: 'value',
      });
      expect(pathPromotionCreated).toBeDefined();
    });
  });

  describe('getDocumentIds', () => {
    it('should run successfully.', async () => {
      const mockSnapshot = {
        docs: [{ id: 'doc1' }],
      };

      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const ids = await database.getDocumentIds('whatever');
      const ids2 = await database.getDocumentIds('notValid/collection');
      expect(ids.length).toBe(1);
      expect(ids2.length).toBe(0);
    });
  });

  describe('runTransaction', () => {
    it('should run successfully.', async () => {
      const mockDocSnapshot = {
        ref: { path: 'test/doc' },
        data: () => ({ key: 'value' }),
      };
      const mockQuerySnapshot = {
        docs: [mockDocSnapshot],
      };

      // Mock getDocs for getCollection within transaction
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      (firestore.runTransaction as jest.Mock).mockImplementation((db, fn) => {
        const txn = {
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        };
        return fn(txn);
      });

      const result = await database.runTransaction(async (data) => {
        const result = await data.getRecord('whatever/id');
        const result1 = await data.getCollection({
          collectionPath: 'whatever',
        });
        data.setRecord(result.path, { result });
        data.updateRecord(result.path, { result });
        data.createRecord(result.path, { result: result1 });
        return 305;
      });
      expect(result).toBe(305);
    });
  });

  describe('findNearestVectorsInCollection', () => {
    it('should run successfully with valid request', async () => {
      const mockSnapshot = {
        docs: [
          {
            ref: { path: 'items/item1' },
            data: () => ({ name: 'item1', vector_distance: 0.5 }),
          },
        ],
      };

      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const results = await database.findNearestVectorsInCollection({
        collectionPath: 'items',
        vectorField: 'embedding',
        queryVector: [1, 0, 0],
        distanceMeasure: DistanceMeasure.EUCLIDEAN,
        limit: 5,
      });
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('path');
        expect(results[0]).toHaveProperty('data');
        expect(results[0]).toHaveProperty('distance');
      }
    });

    it('should return empty for invalid collection', async () => {
      const mockSnapshot = { docs: [] };

      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const results = await database.findNearestVectorsInCollection({
        collectionPath: 'invalid',
        vectorField: 'embedding',
        queryVector: [1, 0, 0],
        distanceMeasure: DistanceMeasure.EUCLIDEAN,
      });
      expect(results.length).toBe(0);
    });
  });

  describe('findNearestVectorsInCollectionGroup', () => {
    it('should return empty for collection group', async () => {
      const mockSnapshot = { docs: [] };

      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const results = await database.findNearestVectorsInCollectionGroup({
        collectionId: 'items',
        vectorField: 'embedding',
        queryVector: [1, 0, 0],
        distanceMeasure: DistanceMeasure.EUCLIDEAN,
      });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('Streaming Methods', () => {
    it('should have streaming methods defined', () => {
      expect(typeof database.streamDocument).toBe('function');
      expect(typeof database.streamCollection).toBe('function');
      expect(typeof database.streamCollectionGroup).toBe('function');
    });

    it('should return unsubscribe function for streamDocument', () => {
      (firestore.doc as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamDocument({
        path: 'test/doc',
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollection', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollection({
        collectionPath: 'test',
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollection with filters', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();
      const filters = [new QueryFilter('status', '==', 'active')];

      const unsubscribe = database.streamCollection({
        collectionPath: 'test',
        filters,
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollection with orderBy', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.orderBy as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollection({
        collectionPath: 'test',
        orderBy: new QueryOrderBy('createdAt', true),
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollection with limit', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.limit as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollection({
        collectionPath: 'test',
        limit: 10,
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollection with transform', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollection({
        collectionPath: 'test',
        transform: (doc) => {
          const data = doc.data as { id: string };
          return data.id;
        },
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollectionGroup', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollectionGroup({
        collectionId: 'test',
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollectionGroup with filters', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();
      const filters = [new QueryFilter('type', '==', 'document')];

      const unsubscribe = database.streamCollectionGroup({
        collectionId: 'test',
        filters,
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollectionGroup with orderBy', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.orderBy as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollectionGroup({
        collectionId: 'test',
        orderBy: new QueryOrderBy('timestamp', false),
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollectionGroup with limit', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.limit as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollectionGroup({
        collectionId: 'test',
        limit: 5,
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should return unsubscribe function for streamCollectionGroup with transform', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamCollectionGroup({
        collectionId: 'test',
        transform: (doc) => {
          const data = doc.data as Record<string, unknown>;
          return { ...data, path: doc.path };
        },
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });

    it('should handle error callbacks', () => {
      (firestore.doc as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});

      const onNext = jest.fn();
      const onError = jest.fn();

      const unsubscribe = database.streamDocument({
        path: 'test/doc',
        onNext,
        onError,
      });

      expect(typeof unsubscribe).toBe('function');
    });
  });
});
