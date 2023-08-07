import {
  Database,
  DatabaseDocument,
  DatabaseTransaction,
  GetCollectionGroupRequest,
  GetCollectionRequest,
} from '../../database';
import type {
  Firestore,
  CollectionReference,
  Query,
  QuerySnapshot,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
  UpdateData,
  CollectionGroup,
} from 'firebase-admin/lib/firestore';
import {
  isValidCollectionPath,
  isValidDocumentPath,
} from '../../utils/path_utils';

/**
 * A class that we use to prepare a request to the firestore database.
 */
class DatabaseQuery<P, HR, TR> {
  /**
   * Constructs a new {DatabaseQuery}.
   * @param {Query | DocumentReference} ref will be the parameter of the {fetchDatabaseRequest} when called.
   * @param {Function} fetchDatabaseRequest a function to call to retrieve data from the database.
   * @param {Function} transform a function called for transforming data returned buy the database.
   */
  constructor(
    public ref: P,
    private fetchDatabaseRequest: (param: P) => Promise<HR>,
    public transform: (param: HR) => TR
  ) {}

  /**
   * Fetches data to the database and returns a transformed response.
   */
  public async get(): Promise<TR> {
    return this.transform(await this.fetchDatabaseRequest(this.ref));
  }
}

/**
 * An identify function.
 * @param {unknown} data
 * @return {object}
 */
const defaultTransform = <R>(data: unknown) => data as R;

/**
 * Firestore implementation of Database.
 */
export class FirestoreDatabase implements Database {
  /**
   * Constructs a new Firestore database.
   * @param {Function} firestoreDB the firestore database.
   */
  constructor(private firestoreDB: Firestore) {}

  /**
   * Creates a database document with the given path.
   * @param {string} collectionPath The database collection path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {string | undefined} The path of document create.
   */
  async createRecord<T = unknown>(
    collectionPath: string,
    data: T
  ): Promise<string | undefined> {
    const documentRef = await this.firestoreDB
      .collection(collectionPath)
      .add(data as DocumentData);
    return documentRef.path;
  }

  /**
   * Creates or replaces a database document with the given path.
   * @param {string} path The database path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {boolean} The operation status.
   */
  async setRecord<T = unknown>(
    path: string,
    data: Partial<T>
  ): Promise<boolean> {
    await this.firestoreDB.doc(path).set(data, { merge: true });
    return true;
  }

  /**
   * Returns the document at the corresponding path.
   * @param {string} path The database path to the document or collection.
   * @return {Object | undefined} The document data.
   */
  getRecordQuery<T = unknown>(
    path: string
  ): DatabaseQuery<
    DocumentReference<T>,
    DocumentSnapshot<T>,
    DatabaseDocument<T | undefined>
  > {
    return new DatabaseQuery<
      DocumentReference<T>,
      DocumentSnapshot<T>,
      DatabaseDocument<T | undefined>
    >(
      isValidDocumentPath(path) || !path
        ? (this.firestoreDB.doc(path) as DocumentReference<T>)
        : (this.firestoreDB.collection(path).doc() as DocumentReference<T>),
      (docRef) => docRef.get(),
      (snapshot) => ({
        path: snapshot.ref.path,
        data: snapshot.data(),
      })
    );
  }

  /**
   * Returns the document at the corresponding path.
   * @param {string} path The database path to the document.
   * @return {Object | undefined} The document data.
   */
  async getRecord<T = unknown>(
    path: string
  ): Promise<DatabaseDocument<T | undefined>> {
    return this.getRecordQuery<T>(path).get();
  }

  /**
   * Returns a path and T collection record using the specified filters.
   * @param {string} collectionPath The path to the collection.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {number} limit The result limit.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  getCollectionQuery<T = unknown, R = DatabaseDocument<T>>({
    collectionPath,
    orderBy,
    filters,
    limit,
    transform,
  }: GetCollectionRequest<T, R>): DatabaseQuery<
    Query<T>,
    QuerySnapshot<T>,
    R[]
  > {
    const transformer = transform || defaultTransform;
    let query: Query<T> = this.firestoreDB.collection(
      collectionPath
    ) as CollectionReference<T>;

    for (const filter of filters || []) {
      query = query.where(filter.fieldPath, filter.opStr, filter.value);
    }
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.descending ? 'desc' : 'asc');
    }
    if (limit) {
      query = query.limit(limit);
    }
    return new DatabaseQuery<Query<T>, QuerySnapshot<T>, R[]>(
      query,
      (query) => query.get(),
      (snapshot) =>
        snapshot.docs.map((doc) =>
          transformer({
            path: doc.ref.path,
            data: doc.data(),
          })
        )
    );
  }

  /**
   * Returns a path and T collection record using the specified filters.
   * @param {string} collectionPath The path to the collection.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {number} limit The result limit.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  async getCollection<T = unknown, R = DatabaseDocument<T>>({
    collectionPath,
    filters,
    limit,
    orderBy,
    transform = ({ path, data }) => ({ path, data } as unknown as R),
  }: GetCollectionRequest<T, R>): Promise<R[]> {
    return this.getCollectionQuery<T, R>({
      collectionPath,
      orderBy,
      limit,
      filters,
      transform,
    }).get();
  }

  /**
   * Returns a collection of T using the specified filters.
   * @param {string} collectionId The ID of the collection group.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {number} limit The result limit.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  getCollectionGroupQuery<T = unknown, R = DatabaseDocument<T>>({
    collectionId,
    orderBy,
    limit,
    filters,
    transform,
  }: GetCollectionGroupRequest<T, R>): DatabaseQuery<
    Query<T>,
    QuerySnapshot<T>,
    R[]
  > {
    const transformer = transform || defaultTransform;
    let query: Query<T> = this.firestoreDB.collectionGroup(
      collectionId
    ) as CollectionGroup<T>;
    for (const filter of filters || []) {
      query = query.where(filter.fieldPath, filter.opStr, filter.value);
    }
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.descending ? 'desc' : 'asc');
    }

    if (limit) {
      query = query.limit(limit);
    }

    return new DatabaseQuery<Query<T>, QuerySnapshot<T>, R[]>(
      query,
      (query) => query.get(),
      (snapshot) =>
        snapshot.docs.map((doc) =>
          transformer({
            path: doc.ref.path,
            data: doc.data(),
          })
        )
    );
  }

  /**
   * Returns a collection of T using the specified filters.
   * @param {string} collectionId The ID of the collection group.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {number} limit The result limit.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {Function} transform The method that transform each value to a desired result.
   * @return {Object[]} Array of objects found.
   */
  async getCollectionGroup<T = unknown, R = DatabaseDocument<T>>({
    collectionId,
    orderBy,
    limit,
    filters,
    transform,
  }: GetCollectionGroupRequest<T, R>): Promise<R[]> {
    return this.getCollectionGroupQuery<T, R>({
      collectionId,
      orderBy,
      limit,
      filters,
      transform,
    }).get();
  }

  /**
   * Returns document's ids array of a given collection.
   * @param {string} collectionPath The path to the collection.
   * @return {string[]} Array of document ids found.
   */
  async getDocumentIds(collectionPath: string): Promise<string[]> {
    if (!isValidCollectionPath(collectionPath)) {
      return [];
    }
    const snapshot = await this.firestoreDB.collection(collectionPath).get();
    return snapshot.docs.map((doc) => doc.id);
  }

  /**
   * Creates a new Database transaction.
   * @param {Function} handler A transaction function to call.
   * NOTE: The handler should be [idempotent](https://en.wikipedia.org/wiki/Idempotence).
   * Assume that it will be called more than once, because concurrent database writes may cause a retry.
   * @return {Promise<T>}
   */
  runTransaction<T>(
    handler: (param: DatabaseTransaction) => Promise<T>
  ): Promise<T> {
    return this.firestoreDB.runTransaction<T>((transaction) => {
      const getCollectionQuery = this.getCollectionQuery.bind(this);
      const getRecordQuery = this.getRecordQuery.bind(this);
      const customTransaction: DatabaseTransaction = {
        getCollection: async <T, R>(data: GetCollectionRequest<T, R>) => {
          const query = getCollectionQuery<T, R>(data);
          return query.transform(await transaction.get<T>(query.ref));
        },
        getRecord: async <T>(path: string) => {
          const query = getRecordQuery<T>(path);
          return query.transform(await transaction.get<T>(query.ref));
        },
        updateRecord: <T>(path: string, data: Partial<T>) => {
          const query = getRecordQuery<T>(path);
          transaction.update<T>(query.ref, data as UpdateData<T>);
        },
        createRecord: <T>(path: string, data: T) => {
          const query = getRecordQuery<T>(path);
          transaction.create<T>(query.ref, data);
        },
        setRecord: <T>(path: string, data: Partial<T>) => {
          const query = getRecordQuery<T>(path);
          transaction.set<T>(query.ref, data, { merge: true });
        },
      };
      return handler(customTransaction);
    });
  }
}
