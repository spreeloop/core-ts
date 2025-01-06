import { exportedForTesting } from './fake';
import {
  getDatabasePath,
  getParentCollectionPath,
} from '../../utils/path_utils';
import { QueryOrderBy } from '../../utils/query_order_by';
import { TestData } from './test_data';
import { QueryFilter } from '../../utils/query_filter';
import { Database } from '../../database';

const fakePromotion = {
  isActive: false,
  createdAt: '24/02/2022',
  promoCode: '',
  maxUsageCount: 0,
  discount: 0,
  discountType: 'PERCENTAGE',
  appliesOn: 'itemPrice',
  creatorPath: '',
  placesPaths: [],
  menuItemsPaths: [],
  minAmountToSpend: 0,
};

type Promotion = typeof fakePromotion;

describe('getNestedValue', () => {
  it('should return the value for a valid dot-separated path', () => {
    const obj = {
      a: {
        b: {
          c: 42,
        },
      },
    };
    const result = exportedForTesting.getNestedValue(obj, 'a.b.c');
    expect(result).toBe(42);
  });

  it('should return undefined for an invalid path', () => {
    const obj = {
      a: {
        b: {
          c: 42,
        },
      },
    };
    const result = exportedForTesting.getNestedValue(obj, 'a.b.x');
    expect(result).toBeUndefined();
  });

  it('should return undefined if part of the path is not an object', () => {
    const obj = {
      a: {
        b: 'notAnObject',
      },
    };
    const result = exportedForTesting.getNestedValue(obj, 'a.b.c');
    expect(result).toBeUndefined();
  });

  it('should return the root object for an empty path', () => {
    const obj = { a: 1 };
    const result = exportedForTesting.getNestedValue(obj, '');
    expect(result).toBeUndefined();
  });

  it('should handle paths with a single key', () => {
    const obj = { a: 42 };
    const result = exportedForTesting.getNestedValue(obj, 'a');
    expect(result).toBe(42);
  });

  it('should return undefined if the object is empty', () => {
    const obj = {};
    const result = exportedForTesting.getNestedValue(obj, 'a.b.c');
    expect(result).toBeUndefined();
  });

  it('should handle nested objects with arrays correctly', () => {
    const obj = {
      a: {
        b: [{ c: 42 }, { d: 99 }],
      },
    };
    const result = exportedForTesting.getNestedValue(obj, 'a.b.0.c');
    expect(result).toBe(42);
  });
});

describe('deepClone', () => {
  it('should return a deep object clone', () => {
    const data = { deep: { key: 'value' } };
    const clone = exportedForTesting.deepClone(data);
    expect(clone).toEqual(data);
    clone.deep.key = 'change';
    expect(clone).not.toEqual(data);
    expect(data).toEqual({ deep: { key: 'value' } });
  });
});

describe('allFiltersMatch', () => {
  it('should return a true when all match', () => {
    const data = { name: 'jhon', age: 20, status: 'student' };
    const result = exportedForTesting.allFiltersMatch(
      [
        new QueryFilter('name', '==', 'jhon'),
        new QueryFilter('age', '>=', 20),
        new QueryFilter('age', '<=', 20),
        new QueryFilter('age', '>', 10),
        new QueryFilter('age', '<', 30),
        new QueryFilter('status', '!=', 'worker'),
        new QueryFilter('status', 'in', ['worker', 'student']),
      ],
      data
    );
    expect(result).toBe(true);
  });
  it('should return a false on any no matching field', () => {
    const data = { name: 'jhon', age: 20, status: 'student' };
    const result = exportedForTesting.allFiltersMatch(
      [new QueryFilter('name', '!=', 'jhon')],
      data
    );
    expect(result).toBe(false);
  });
});

describe('isValidCollection', () => {
  it('should return a false on invalid data provided', () => {
    const result1 = exportedForTesting.isValidCollection([]);
    const result2 = exportedForTesting.isValidCollection('');
    const result3 = exportedForTesting.isValidCollection(0);
    const result4 = exportedForTesting.isValidCollection(new Date());
    const result5 = exportedForTesting.isValidCollection(new Set());
    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
    expect(result4).toBe(false);
    expect(result5).toBe(false);
  });

  it('should return a false on invalid document found', () => {
    const result1 = exportedForTesting.isValidCollection({ key: [] });
    const result2 = exportedForTesting.isValidCollection({ key: '' });
    const result3 = exportedForTesting.isValidCollection({ key: 0 });
    const result4 = exportedForTesting.isValidCollection({ key: new Date() });
    const result5 = exportedForTesting.isValidCollection({ key: new Set() });
    expect(result1).toBe(false);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
    expect(result4).toBe(false);
    expect(result5).toBe(false);
  });

  it('should return true on invalid document found', () => {
    const result1 = exportedForTesting.isValidCollection({
      key: {},
      key2: null,
    });
    const result2 = exportedForTesting.isValidCollection({
      key: { field: 'value', fieldMap: { k: 1 } },
    });
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });
});

describe('recursivelyFindCollection', () => {
  const data = {
    root1: {
      doc1: {
        collection2: {
          doc1: {
            key1: 1,
            key2: 'value',
          },
        },
      },
      doc2: {
        collection2: {
          doc1: {
            key1: 1,
            key2: 'value',
          },
        },
      },
      collection1: {
        collection1: {
          doc1: {
            key1: 1,
            key2: 'value',
          },
        },
      },
    },
  };

  it('should find exactly two collections with id `collection2`.', () => {
    const allCollectionGroupPath = new Set();
    exportedForTesting.recursivelyFindCollection(
      data,
      '',
      'collection2',
      (documentPath) => {
        allCollectionGroupPath.add(getParentCollectionPath(documentPath));
      }
    );
    expect(allCollectionGroupPath.size).toBe(2);
    expect(allCollectionGroupPath.has('root1/doc1/collection2')).toBe(true);
    expect(allCollectionGroupPath.has('root1/doc2/collection2')).toBe(true);
  });

  it('should find exactly one collection with id `collection1`.', () => {
    const allCollectionGroupPath = new Set();
    let collectionGroupValue: Record<string, unknown> | undefined;
    exportedForTesting.recursivelyFindCollection(
      data,
      '',
      'collection1',
      (documentPath, value) => {
        allCollectionGroupPath.add(getParentCollectionPath(documentPath));
        collectionGroupValue = value;
      }
    );
    expect(allCollectionGroupPath.size).toBe(1);
    expect(collectionGroupValue).toEqual({
      key1: 1,
      key2: 'value',
    });
  });

  it('should not find a collection with id `doc1`.', () => {
    const allCollectionGroupPath = new Set();
    exportedForTesting.recursivelyFindCollection(data, '', 'doc1', () => null);
    expect(allCollectionGroupPath.size).toBe(0);
  });

  it('should not find a collection with id `notfound`.', () => {
    const allCollectionGroupPath = new Set();
    exportedForTesting.recursivelyFindCollection(
      data,
      '',
      'notfound',
      () => null
    );
    expect(allCollectionGroupPath.size).toBe(0);
  });
});

describe('FakeDatabase', () => {
  describe('getRecord', () => {
    const fakeDatabase = Database.createFake(TestData);
    it('should return undefined if the path is not found.', async () => {
      const document = await fakeDatabase.getRecord('collection/notfound');
      const document1 = await fakeDatabase.getRecord('collection');
      expect(document.data).toBeUndefined();
      expect(document1.data).toBeUndefined();
    });
    it('should return a valid database document.', async () => {
      const document = await fakeDatabase.getRecord('promotions/promotion_1');
      expect(document.data).toBeDefined();
      expect(document?.constructor).toBe(Object);
    });
  });

  describe('getCollectionGroup', () => {
    const fakeDatabase = Database.createFake(TestData);
    it('should return an empty array if no collection group was found.', async () => {
      const document = await fakeDatabase.getCollectionGroup({
        collectionId: 'notfound/dad',
      });
      const document1 = await fakeDatabase.getCollectionGroup({
        collectionId: 'notfound',
        limit: 2,
      });
      expect(document.length).toBe(0);
      expect(document1.length).toBe(0);
    });
    it('should return a list of document available which parent collection id match `promotion`', async () => {
      const documents = await fakeDatabase.getCollectionGroup({
        collectionId: 'promotions',
      });
      const documents2 = await fakeDatabase.getCollectionGroup({
        collectionId: 'promotions',
        filters: [new QueryFilter('promoCode', '==', 'CMR237')],
      });
      expect(documents.length).toBe(3);
      expect(documents2.length).toBe(1);
    });
    it('should return a list of document available which parent collection id match `promotion` by descending discount false', async () => {
      const document = await fakeDatabase.getCollectionGroup<
        Promotion,
        Promotion
      >({
        collectionId: 'promotions',
        orderBy: new QueryOrderBy('discount', false),
        transform: (props) => props.data,
      });
      expect(document.length).toBeGreaterThanOrEqual(3);
      const sort = document[0].discount < document[2].discount;
      expect(sort).toBe(true);
    });
    it('should return a list of document available which parent collection id match `promotion` by descending discount true', async () => {
      const document = await fakeDatabase.getCollectionGroup<Promotion>({
        collectionId: 'promotions',
        orderBy: new QueryOrderBy('discount', true),
      });
      expect(document.length).toBeGreaterThanOrEqual(3);
      const sort = document[0].data?.discount > document[2].data?.discount;
      expect(sort).toBe(true);
    });
  });

  describe('getCollection', () => {
    const fakeDatabase = Database.createFake(TestData);
    it('should return an empty array if no collection was found.', async () => {
      const document = await fakeDatabase.getCollection({
        collectionPath: 'notfound',
        limit: 2,
      });
      const document2 = await fakeDatabase.getCollection({
        collectionPath: 'badCollection/path',
        limit: 2,
      });
      expect(document.length).toBe(0);
      expect(document2.length).toBe(0);
    });
    it('should return a list of document available which parent collection id match `promotions`', async () => {
      const document = await fakeDatabase.getCollection({
        collectionPath: 'promotions',
        limit: 2,
      });
      expect(document.length).toBe(2);
    });
    it('should return a list of document available which parent collection id match `promotion` by descending discount false', async () => {
      const document = await fakeDatabase.getCollection<Promotion>({
        collectionPath: 'promotions',
        orderBy: new QueryOrderBy('discount', false),
      });
      const sort = document[0].data?.discount < document[2].data?.discount;
      expect(sort).toBe(true);
    });
    it('should return a list of document available which parent collection id match `promotion` by descending discount true', async () => {
      const document = await fakeDatabase.getCollection<Promotion, Promotion>({
        collectionPath: 'promotions',
        orderBy: new QueryOrderBy('discount', true),
        transform: (props) => props.data,
      });
      const sort = document[0]?.discount > document[2]?.discount;
      expect(sort).toBe(true);
    });
    it('should return a list of promotion document with discount type equal (PERCENTAGE)', async () => {
      const real = await fakeDatabase.getCollection<Promotion, Promotion>({
        collectionPath: 'promotions',
        filters: [new QueryFilter('discountType', '==', 'PERCENTAGE')],
      });
      const document = await fakeDatabase.getCollection<Promotion, Promotion>({
        collectionPath: 'promotions',
        filters: [new QueryFilter('discountType', 'in', ['PERCENTAGE'])],
      });
      expect(document.length).toBe(real.length);
    });
  });
  describe('setRecord', () => {
    const fakeDatabase = Database.createFake(
      exportedForTesting.deepClone(TestData)
    );
    it('should return false on invalid data provided.', async () => {
      const result1 = await fakeDatabase.setRecord('notfound', {});
      const result2 = await fakeDatabase.setRecord(
        'promotions/promotion_1',
        []
      );
      const result3 = await fakeDatabase.setRecord(
        'promotions/promotion_1/subCollection/notfound',
        {}
      );
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });
    it('should create a new promotion if the path is not found.', async () => {
      const result1 = await fakeDatabase.setRecord(
        getDatabasePath('promotions', 'notfound_promotion'),
        {
          ...fakePromotion,
        }
      );
      expect(result1).toBe(true);
    });
    it('should return true when update done.', async () => {
      const before = await fakeDatabase.getRecord<Promotion>(
        'promotions/promotion_1'
      );
      const beforeMaxUsage = (before?.data || {})['maxUsageCount'] || 0;
      const result1 = await fakeDatabase.setRecord<Promotion>(
        'promotions/promotion_1',
        { ['maxUsageCount']: beforeMaxUsage + 12 }
      );
      const after = await fakeDatabase.getRecord<Promotion>(
        'promotions/promotion_1'
      );
      const afterMaxUsage = (after?.data || {})['maxUsageCount'];
      expect(result1).toBe(true);
      expect(afterMaxUsage).toBe(beforeMaxUsage + 12);
    });
  });
  describe('createRecord', () => {
    const fakeDatabase = Database.createFake(
      exportedForTesting.deepClone(TestData)
    );
    it('should return undefined on invalid data', async () => {
      const result = await fakeDatabase.createRecord<Promotion>(
        'badCollection/path',
        fakePromotion
      );
      const result1 = await fakeDatabase.createRecord<Promotion>(
        'undefined_collection',
        fakePromotion
      );
      expect(result).toBeUndefined();
      expect(result1).toBeUndefined();
    });
    it('should return path when create done.', async () => {
      const pathPromotionCreated = await fakeDatabase.createRecord<Promotion>(
        'promotions',
        fakePromotion
      );
      if (!pathPromotionCreated) {
        return;
      }
      const recordGot = await fakeDatabase.getRecord<Promotion>(
        pathPromotionCreated
      );
      expect(recordGot?.data?.promoCode).toEqual(fakePromotion.promoCode);
      expect(recordGot?.data?.placesPaths).toEqual(fakePromotion.placesPaths);
    });
  });
  describe('runTransaction', () => {
    const fakeDatabase = Database.createFake(TestData);
    it('should return the value returned by the handler', async () => {
      const result = await fakeDatabase.runTransaction(async () => {
        return 123;
      });
      expect(result).toBe(123);
    });
  });
  describe('getDocumentIds', () => {
    const fakeDatabase = Database.createFake(TestData);
    it('should return a list of all document ids from `promotions` collection', async () => {
      const ids = await fakeDatabase.getDocumentIds('promotions');
      expect(ids.length).toBe(3);
      expect(ids[0]).toBe('promotion_1');
    });
    it('should return an empty list for wrong collection path.', async () => {
      const wrongPromotionPath = '/';
      const ids = await fakeDatabase.getDocumentIds(wrongPromotionPath);
      expect(ids.length).toBe(0);
    });
    it("should return an empty list for collection that doesn't exist.", async () => {
      const ids = await fakeDatabase.getDocumentIds('promotion');
      expect(ids.length).toBe(0);
    });
  });
});
