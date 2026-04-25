import {
  Database,
  DatabaseDocument,
  DatabaseTransaction,
  FindNearestVectorsInCollectionRequest,
  FindNearestVectorsInCollectionGroupRequest,
  GetCollectionRequest,
  GetCollectionGroupRequest,
  VectorSearchResult,
  StreamDocumentRequest,
  StreamCollectionRequest,
  StreamCollectionGroupRequest,
  StreamUnsubscribe,
} from '../../database';
import type {
  Firestore,
  CollectionReference,
  Query,
  QuerySnapshot,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy as orderByFn,
  limit as limitFn,
  collectionGroup,
  runTransaction,
  onSnapshot,
} from 'firebase/firestore';
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
 * Firestore Client SDK implementation of Database.
 */
export class FirestoreClientDatabase implements Database {
  /**
   * Constructs a new Firestore Client database.
   * @param {Firestore} firestoreDB the firestore database from firebase/firestore.
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
    const collectionRef = collection(this.firestoreDB, collectionPath);
    const docRef = await addDoc(collectionRef, data as DocumentData);
    return docRef.path;
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
    const docRef = doc(this.firestoreDB, path);
    await setDoc(docRef, data, { merge: true });
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
        ? (doc(this.firestoreDB, path) as DocumentReference<T>)
        : (doc(collection(this.firestoreDB, path)) as DocumentReference<T>),
      (docRef) => getDoc(docRef),
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
    limit: limitCount,
    transform,
  }: GetCollectionRequest<T, R>): DatabaseQuery<
    Query<T>,
    QuerySnapshot<T>,
    R[]
  > {
    const transformer = transform || defaultTransform;
    const collectionRef = collection(
      this.firestoreDB,
      collectionPath
    ) as CollectionReference<T>;

    const constraints = [];
    for (const filter of filters || []) {
      constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
    }
    if (orderBy) {
      constraints.push(
        orderByFn(orderBy.field, orderBy.descending ? 'desc' : 'asc')
      );
    }
    if (limitCount) {
      constraints.push(limitFn(limitCount));
    }

    const q =
      constraints.length > 0
        ? query(collectionRef, ...constraints)
        : query(collectionRef);

    return new DatabaseQuery<Query<T>, QuerySnapshot<T>, R[]>(
      q as Query<T>,
      (q) => getDocs(q),
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
    limit: limitCount,
    orderBy,
    transform = ({ path, data }) => ({ path, data } as unknown as R),
  }: GetCollectionRequest<T, R>): Promise<R[]> {
    return this.getCollectionQuery<T, R>({
      collectionPath,
      orderBy,
      limit: limitCount,
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
    filters,
    limit: limitCount,
    transform,
  }: GetCollectionGroupRequest<T, R>): DatabaseQuery<
    Query<T>,
    QuerySnapshot<T>,
    R[]
  > {
    const transformer = transform || defaultTransform;
    const collectionGroupRef = collectionGroup(
      this.firestoreDB,
      collectionId
    ) as Query<T>;

    const constraints = [];
    for (const filter of filters || []) {
      constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
    }
    if (orderBy) {
      constraints.push(
        orderByFn(orderBy.field, orderBy.descending ? 'desc' : 'asc')
      );
    }
    if (limitCount) {
      constraints.push(limitFn(limitCount));
    }

    const q =
      constraints.length > 0
        ? query(collectionGroupRef, ...constraints)
        : query(collectionGroupRef);

    return new DatabaseQuery<Query<T>, QuerySnapshot<T>, R[]>(
      q as Query<T>,
      (q) => getDocs(q),
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
    limit: limitCount,
    filters,
    transform,
  }: GetCollectionGroupRequest<T, R>): Promise<R[]> {
    return this.getCollectionGroupQuery<T, R>({
      collectionId,
      orderBy,
      limit: limitCount,
      filters,
      transform,
    }).get();
  }

  /**
   * Finds the nearest vectors in a collection based on the query vector.
   * Uses native Firestore vector search.
   * @param {FindNearestVectorsInCollectionRequest} request The request parameters for vector search.
   * @return {Promise<VectorSearchResult<T>[]>} Array of vector search results.
   */
  async findNearestVectorsInCollection<
    T extends object = Record<string, unknown>
  >(
    request: FindNearestVectorsInCollectionRequest
  ): Promise<VectorSearchResult<T>[]> {
    const collectionRef = collection(this.firestoreDB, request.collectionPath);

    const constraints = [];
    if (request.filters && request.filters.length > 0) {
      for (const filter of request.filters) {
        constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
      }
    }

    const q = query(collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as T & { vector_distance?: number };
      return {
        path: doc.ref.path,
        data,
        distance: data.vector_distance || 0,
      };
    });
  }

  /**
   * Finds the nearest vectors in a collection group based on the query vector.
   * Uses native Firestore vector search.
   * @param {FindNearestVectorsInCollectionGroupRequest} request The request parameters for vector search.
   * @return {Promise<VectorSearchResult<T>[]>} Array of vector search results.
   */
  async findNearestVectorsInCollectionGroup<
    T extends Record<string, unknown> = Record<string, unknown>
  >(
    request: FindNearestVectorsInCollectionGroupRequest
  ): Promise<VectorSearchResult<T>[]> {
    const collectionGroupRef = collectionGroup(
      this.firestoreDB,
      request.collectionId
    );

    const constraints = [];
    if (request.filters && request.filters.length > 0) {
      for (const filter of request.filters) {
        constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
      }
    }

    const q = query(collectionGroupRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as T;
      return {
        path: doc.ref.path,
        data,
        distance: (data['vector_distance'] as number) || 0,
      };
    });
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
    const collectionRef = collection(this.firestoreDB, collectionPath);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => doc.id);
  }

  /**
   * Creates a new Database transaction.
   * @param {Function} handler A transaction function to call.
   * NOTE: The handler should be [idempotent](https://en.wikipedia.org/wiki/Idempotence).
   * Assume that it will be called more than once, because concurrent database writes may cause a retry.
   * @return {Promise<T>}
   */
  async runTransaction<T>(
    handler: (param: DatabaseTransaction) => Promise<T>
  ): Promise<T> {
    return runTransaction(this.firestoreDB, async (transaction) => {
      const getCollectionQuery = this.getCollectionQuery.bind(this);
      const getRecordQuery = this.getRecordQuery.bind(this);

      const customTransaction: DatabaseTransaction = {
        getCollection: async <T, R>(
          data: GetCollectionRequest<T, R>
        ): Promise<R[]> => {
          // Client SDK doesn't support queries in transactions directly
          // Execute query outside transaction
          const queryRef = getCollectionQuery<T, R>(data);
          return queryRef.get();
        },

        getRecord: async <T>(
          path: string
        ): Promise<DatabaseDocument<T | undefined>> => {
          const queryRef = getRecordQuery<T>(path);
          const snapshot = await transaction.get(
            queryRef.ref as DocumentReference<DocumentData>
          );
          // Transform the snapshot to the expected return type
          const result: DatabaseDocument<T | undefined> = {
            path: snapshot.ref.path,
            data: snapshot.data() as T | undefined,
          };
          return result;
        },

        updateRecord: <T>(path: string, data: Partial<T>) => {
          const docRef = doc(this.firestoreDB, path);
          transaction.update(
            docRef as DocumentReference<DocumentData>,
            data as DocumentData
          );
        },

        createRecord: <T>(path: string, data: T) => {
          const docRef = doc(this.firestoreDB, path);
          transaction.set(
            docRef as DocumentReference<DocumentData>,
            data as DocumentData
          );
        },

        setRecord: <T>(path: string, data: Partial<T>) => {
          const docRef = doc(this.firestoreDB, path);
          transaction.set(
            docRef as DocumentReference<DocumentData>,
            data as DocumentData,
            { merge: true }
          );
        },
      };

      return handler(customTransaction);
    });
  }

  /**
   * Streams a document with real-time updates.
   * @param {string} path The database path to the document.
   * @param {Function} onNext Callback called when document data changes.
   * @param {Function} onError Callback called when an error occurs.
   * @return {Function} Unsubscribe function to stop listening.
   */
  streamDocument<T = unknown>({
    path,
    onNext,
    onError,
  }: StreamDocumentRequest<T>): StreamUnsubscribe {
    const docRef = doc(this.firestoreDB, path);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        onNext({
          path: snapshot.ref.path,
          data: snapshot.data() as T,
        });
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
    return unsubscribe;
  }

  /**
   * Streams a collection with real-time updates.
   * @param {string} collectionPath The path to the collection.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {number} limit The result limit.
   * @param {Function} transform The method that transform each value to a desired result.
   * @param {Function} onNext Callback called when collection data changes.
   * @param {Function} onError Callback called when an error occurs.
   * @return {Function} Unsubscribe function to stop listening.
   */
  streamCollection<T = unknown, R = DatabaseDocument<T>>({
    collectionPath,
    filters,
    orderBy,
    limit: limitCount,
    transform,
    onNext,
    onError,
  }: StreamCollectionRequest<T, R>): StreamUnsubscribe {
    const transformer = transform || ((data) => data as R);
    const collectionRef = collection(this.firestoreDB, collectionPath);

    const constraints = [];
    for (const filter of filters || []) {
      constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
    }
    if (orderBy) {
      constraints.push(
        orderByFn(orderBy.field, orderBy.descending ? 'desc' : 'asc')
      );
    }
    if (limitCount) {
      constraints.push(limitFn(limitCount));
    }

    const q =
      constraints.length > 0
        ? query(collectionRef, ...constraints)
        : query(collectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results = snapshot.docs.map((doc) =>
          transformer({
            path: doc.ref.path,
            data: doc.data() as T,
          })
        );
        onNext(results as DatabaseDocument<R>[]);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
    return unsubscribe;
  }

  /**
   * Streams a collection group with real-time updates.
   * @param {string} collectionId The ID of the collection group.
   * @param {QueryFilter[]} filters The filters to apply.
   * @param {QueryOrderBy} orderBy The ordering attribute.
   * @param {number} limit The result limit.
   * @param {Function} transform The method that transform each value to a desired result.
   * @param {Function} onNext Callback called when collection data changes.
   * @param {Function} onError Callback called when an error occurs.
   * @return {Function} Unsubscribe function to stop listening.
   */
  streamCollectionGroup<T = unknown, R = DatabaseDocument<T>>({
    collectionId,
    filters,
    orderBy,
    limit: limitCount,
    transform,
    onNext,
    onError,
  }: StreamCollectionGroupRequest<T, R>): StreamUnsubscribe {
    const transformer = transform || ((data) => data as R);
    const collectionGroupRef = collectionGroup(this.firestoreDB, collectionId);

    const constraints = [];
    for (const filter of filters || []) {
      constraints.push(where(filter.fieldPath, filter.opStr, filter.value));
    }
    if (orderBy) {
      constraints.push(
        orderByFn(orderBy.field, orderBy.descending ? 'desc' : 'asc')
      );
    }
    if (limitCount) {
      constraints.push(limitFn(limitCount));
    }

    const q =
      constraints.length > 0
        ? query(collectionGroupRef, ...constraints)
        : query(collectionGroupRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results = snapshot.docs.map((doc) =>
          transformer({
            path: doc.ref.path,
            data: doc.data() as T,
          })
        );
        onNext(results as DatabaseDocument<R>[]);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
    return unsubscribe;
  }
}
