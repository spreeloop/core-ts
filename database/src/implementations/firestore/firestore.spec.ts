import { Firestore } from 'firebase-admin/lib/firestore';
import { fakeFirestoreDatabase } from './fake_firestore_interface';
import { QueryOrderBy } from '../../utils/query_order_by';
import { QueryFilter } from '../../utils/query_filter';
import { Database } from '../../database';

describe('FirestoreDatabase', () => {
  const database = Database.createFirestore(
    fakeFirestoreDatabase as unknown as Firestore
  );
  describe('getRecord', () => {
    it('should run successfully.', async () => {
      const document = await database.getRecord('collection/x');
      expect(document.data).toBeDefined();
    });
  });
  describe('getCollectionGroup', () => {
    it('should run successfully.', async () => {
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
  });
  describe('setRecord', () => {
    it('should run successfully.', async () => {
      const result1 = await database.setRecord('whatever', {});
      expect(result1).toBe(true);
    });
  });
  describe('createRecord', () => {
    it('should run successfully.', async () => {
      const pathPromotionCreated = await database.createRecord('whatever', {
        any: 'value',
      });
      expect(pathPromotionCreated).toBeDefined();
    });
  });
  describe('getDocumentIds', () => {
    it('should run successfully.', async () => {
      const ids = await database.getDocumentIds('whatever');
      const ids2 = await database.getDocumentIds('notValid/collection');
      expect(ids.length).toBe(1);
      expect(ids2.length).toBe(0);
    });
  });
  describe('runTransaction', () => {
    it('should run successfully.', async () => {
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
});
