import { FakeDatabase } from './implementations/fake/fake';
import { FirestoreDatabase } from './implementations/firestore/firestore';
import { Firestore } from 'firebase-admin/lib/firestore';
import { QueryFilter } from './utils/query_filter';
import { QueryOrderBy } from './utils/query_order_by';

export * from './utils/path_utils';
export * from './utils/query_filter';
export * from './utils/query_order_by';

export type DatabaseDocumentTransform<T, R> = (data: DatabaseDocument<T>) => R;

export type GetCollectionGroupRequest<T = unknown, R = unknown> = {
  collectionId: string;
  filters?: QueryFilter[];
  orderBy?: QueryOrderBy<T>;
  limit?: number;
  transform?: DatabaseDocumentTransform<T, R>;
};

export type GetCollectionRequest<T = unknown, R = unknown> = {
  collectionPath: string;
  filters?: QueryFilter[];
  orderBy?: QueryOrderBy<T>;
  limit?: number;
  transform?: DatabaseDocumentTransform<T, R>;
};

export type DatabaseTransaction = {
  getCollection: <T, R>(data: GetCollectionRequest<T, R>) => Promise<R[]>;
  getRecord: <T>(path: string) => Promise<DatabaseDocument<T | undefined>>;
  updateRecord: <T>(path: string, data: Partial<T>) => void;
  createRecord: <T>(path: string, data: T) => void;
  setRecord: <T>(path: string, data: Partial<T>) => void;
};

export interface DatabaseDocument<T = unknown> {
  path: string;
  data: T;
}

/**
 * Class that contains a static enumeration of all
 * final implementations.
 */
export abstract class Database {
  /**
   * Create a new Fake database implementation.
   * @param {Record<string, Record<string, unknown>>} rawData
   * @return {FakeDatabase}
   */
  static createFake(
    rawData: Record<string, Record<string, unknown>>
  ): FakeDatabase {
    return new FakeDatabase(rawData);
  }

  /**
   * Constructs a new Firestore database.
   * @param {Function} firestoreDB the firestore database.
   * @return {FirestoreDatabase}
   */
  static createFirestore(firestoreDB: Firestore): FirestoreDatabase {
    return new FirestoreDatabase(firestoreDB);
  }

  /**
   * Creates a database document with the given path.
   * @param {string} collectionPath The database collection path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {string | undefined} The path of the created document.
   */
  abstract createRecord<T = unknown>(
    collectionPath: string,
    data: T
  ): Promise<string | undefined>;

  /**
   * Creates or updates a database document with the given path.
   * @param {string} path The database path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {boolean} The operation status.
   */
  abstract setRecord<T = unknown>(
    path: string,
    data: Partial<T>
  ): Promise<boolean>;

  /**
   * Returns the document at the corresponding path.
   * @param {string} path The database path to the document.
   * @return {Object | undefined} The document data.
   */
  abstract getRecord<T = unknown>(
    path: string
  ): Promise<DatabaseDocument<T | undefined>>;

  /**
   * Returns a path and T collection record using the specified filters.
   * @param {string} collectionPath The path to the collection.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  abstract getCollection<T = unknown, R = DatabaseDocument<T>>({
    collectionPath,
    filters,
    orderBy,
    transform,
  }: GetCollectionRequest<T, R>): Promise<R[]>;

  /**
   * Returns a collection of T using the specified filters.
   * @param {string} collectionId The ID of the collection group.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  abstract getCollectionGroup<T = unknown, R = DatabaseDocument<T>>({
    collectionId,
    filters,
    orderBy,
    transform,
  }: GetCollectionGroupRequest<T, R>): Promise<R[]>;

  /**
   * Returns document's ids array of a given collection.
   * @param {string} collectionPath The path to the collection.
   * @return {string[]} Array of document ids found.
   */
  abstract getDocumentIds(collectionPath: string): Promise<string[]>;

  /**
   * Creates a new Database transaction.
   * @param {Function} handler A transaction function to call.
   * NOTE: The handler should be [idempotent](https://en.wikipedia.org/wiki/Idempotence).
   * Assume that it will be called more than once, because concurrent database writes may cause a retry.
   * @return {Promise<T>}
   */
  abstract runTransaction<T>(
    handler: (param: DatabaseTransaction) => Promise<T>
  ): Promise<T>;
}
