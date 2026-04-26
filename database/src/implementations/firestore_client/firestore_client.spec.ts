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


import { FirestoreClientDatabase } from './firestore_client';
import { QueryOrderBy } from '../../utils/query_order_by';
import { QueryFilter } from '../../utils/query_filter';
import { DistanceMeasure } from '../../database';
import * as firestore from 'firebase/firestore';

describe('FirestoreClientDatabase', () => {
  let mockDb: any;
  let database: FirestoreClientDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = {};
    database = new FirestoreClientDatabase(mockDb);
  });

  describe('Basic Operations', () => {
    it('should get a record', async () => {
      const mockDocRef = { id: 'doc1', path: 'test/doc1' };
      const mockSnapshot = {
        ref: { path: 'test/doc1' },
        data: () => ({ key: 'value' }),
      };
      
      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.getDoc as jest.Mock).mockResolvedValue(mockSnapshot);
      
      const result = await database.getRecord('test/doc1');
      expect(result.data).toEqual({ key: 'value' });
    });

    it('should get collection', async () => {
      const mockColRef = { id: 'test' };
      const mockQuery = {};
      const mockSnapshot = {
        docs: [
          { ref: { path: 'test/doc1' }, data: () => ({ key: 'val1' }) },
          { ref: { path: 'test/doc2' }, data: () => ({ key: 'val2' }) },
        ],
      };
      
      (firestore.collection as jest.Mock).mockReturnValue(mockColRef);
      (firestore.query as jest.Mock).mockReturnValue(mockQuery);
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      const result = await database.getCollection({ collectionPath: 'test' });
      expect(result.length).toBe(2);
    });

    it('should create record', async () => {
      const mockColRef = { id: 'test' };
      const mockDocRef = { id: 'newdoc', path: 'test/newdoc' };
      
      (firestore.collection as jest.Mock).mockReturnValue(mockColRef);
      (firestore.addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      
      const result = await database.createRecord('test', { data: 'value' });
      expect(result).toBe('test/newdoc');
    });

    it('should set record', async () => {
      const mockDocRef = { id: 'doc1', path: 'test/doc1' };
      
      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);
      
      const result = await database.setRecord('test/doc1', { data: 'value' });
      expect(result).toBe(true);
    });
  });

  describe('Collection Operations', () => {
    it('should get collection with filters', async () => {
      const mockSnapshot = { docs: [] };
      
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      await database.getCollection({
        collectionPath: 'test',
        filters: [new QueryFilter('status', '==', 'active')],
      });
      
      expect(firestore.where).toHaveBeenCalled();
    });

    it('should get collection with orderBy', async () => {
      const mockSnapshot = { docs: [] };
      
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.orderBy as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      await database.getCollection({
        collectionPath: 'test',
        orderBy: new QueryOrderBy('name', true),
      });
      
      expect(firestore.orderBy).toHaveBeenCalled();
    });

    it('should get collection group', async () => {
      const mockSnapshot = {
        docs: [{ ref: { path: 'parent/doc' }, data: () => ({}) }],
      };
      
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      const result = await database.getCollectionGroup({ collectionId: 'items' });
      expect(result.length).toBe(1);
    });
  });

  describe('Transaction', () => {
    it('should run transaction', async () => {
      const mockSnapshot = {
        ref: { path: 'test/doc' },
        data: () => ({ key: 'value' }),
      };
      
      (firestore.runTransaction as jest.Mock).mockImplementation((db, fn) => {
        const txn = {
          get: jest.fn().mockResolvedValue(mockSnapshot),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        };
        return fn(txn);
      });
      
      const result = await database.runTransaction(async (txn) => {
        const doc = await txn.getRecord('test/doc');
        txn.setRecord(doc.path, { updated: true });
        return 'success';
      });
      
      expect(result).toBe('success');
    });
  });

  describe('Vector Search', () => {
    it('should find nearest vectors', async () => {
      const mockSnapshot = {
        docs: [{
          ref: { path: 'items/item1' },
          data: () => ({ name: 'item1', vector_distance: 0.5 }),
        }],
      };
      
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      const result = await database.findNearestVectorsInCollection({
        collectionPath: 'items',
        vectorField: 'embedding',
        queryVector: [1, 0, 0],
        distanceMeasure: DistanceMeasure.EUCLIDEAN,
        limit: 5,
      });
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should find vectors in collection group', async () => {
      const mockSnapshot = {
        docs: [{
          ref: { path: 'parent/items/item1' },
          data: () => ({ name: 'item1' }),
        }],
      };
      
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      
      const result = await database.findNearestVectorsInCollectionGroup({
        collectionId: 'items',
        vectorField: 'embedding',
        queryVector: [1, 0, 0],
        distanceMeasure: DistanceMeasure.COSINE,
      });
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Streaming', () => {
    it('should stream document', () => {
      (firestore.doc as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});
      
      const unsub = database.streamDocument({
        path: 'test/doc',
        onNext: jest.fn(),
        onError: jest.fn(),
      });
      
      expect(typeof unsub).toBe('function');
    });

    it('should stream collection', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});
      
      const unsub = database.streamCollection({
        collectionPath: 'test',
        onNext: jest.fn(),
        onError: jest.fn(),
      });
      
      expect(typeof unsub).toBe('function');
    });

    it('should stream collection with filters', () => {
      (firestore.collection as jest.Mock).mockReturnValue({});
      (firestore.where as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});
      
      const unsub = database.streamCollection({
        collectionPath: 'test',
        filters: [new QueryFilter('status', '==', 'active')],
        onNext: jest.fn(),
        onError: jest.fn(),
      });
      
      expect(typeof unsub).toBe('function');
    });

    it('should stream collection group', () => {
      (firestore.collectionGroup as jest.Mock).mockReturnValue({});
      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(() => {});
      
      const unsub = database.streamCollectionGroup({
        collectionId: 'items',
        onNext: jest.fn(),
        onError: jest.fn(),
      });
      
      expect(typeof unsub).toBe('function');
    });
  });
});
