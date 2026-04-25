/**
 * Fake Firestore Client interface for testing.
 * This provides a mock implementation of the Firebase Client SDK Firestore interface
 * compatible with the FirestoreClientDatabase implementation.
 */

// Mock document data
const mockDocumentData = () => ({
  key: 'value',
  embedding: [1, 0, 0],
});

// Mock document reference for client SDK
const fakeDocReference = {
  id: 'doc-id',
  path: 'collection/doc-id',
  parent: null as unknown,
  get: async () => ({
    ref: {
      path: 'collection/doc-id',
      id: 'doc-id',
    },
    id: 'doc-id',
    exists: true,
    data: mockDocumentData,
  }),
  set: (...args: unknown[]) => {
    console.log('set:', args);
    return Promise.resolve();
  },
  update: (...args: unknown[]) => {
    console.log('update:', args);
    return Promise.resolve();
  },
  delete: () => Promise.resolve(),
};

// Check if collection name is invalid
const isInvalidCollection = (name: string): boolean => name === 'invalid';

// Create mock query result
const createMockQueryResult = (name: string) => ({
  docs: isInvalidCollection(name)
    ? []
    : [
        {
          id: 'doc-id',
          ref: { path: `${name}/doc-id` },
          data: mockDocumentData,
        },
      ],
  empty: isInvalidCollection(name),
  size: isInvalidCollection(name) ? 0 : 1,
});

// Fake Firestore Client database
export const fakeFirestoreClientDatabase = {
  app: { name: '[DEFAULT]' },
  type: 'firestore' as const,

  // Collection method - returns a CollectionReference-like object
  collection(...args: unknown[]) {
    console.log('collection:', args);
    const collectionName = args[0] as string;

    return {
      id: collectionName,
      path: collectionName,
      parent: null,

      // Methods that return Query
      where(...args: unknown[]) {
        console.log('where:', args);
        return this;
      },
      orderBy(...args: unknown[]) {
        console.log('orderBy:', args);
        return this;
      },
      limit(...args: unknown[]) {
        console.log('limit:', args);
        return this;
      },

      // Add document to collection
      add: async (...addArgs: unknown[]) => {
        console.log('add:', addArgs);
        return {
          id: 'new-doc-id',
          path: `${collectionName}/new-doc-id`,
        };
      },

      // Get documents
      get: async () => createMockQueryResult(collectionName),

      // Real-time updates
      onSnapshot(...snapshotArgs: unknown[]) {
        console.log('onSnapshot:', snapshotArgs);
        return () => {
          console.log('unsubscribe');
        };
      },

      // Get document reference
      doc: (docId: string) => ({
        ...fakeDocReference,
        id: docId,
        path: `${collectionName}/${docId}`,
      }),
    };
  },

  // CollectionGroup method
  collectionGroup(...args: unknown[]) {
    console.log('collectionGroup:', args);

    return {
      where(...args: unknown[]) {
        console.log('where:', args);
        return this;
      },
      orderBy(...args: unknown[]) {
        console.log('orderBy:', args);
        return this;
      },
      limit(...args: unknown[]) {
        console.log('limit:', args);
        return this;
      },
      get: async () => createMockQueryResult('collectionGroup'),
      onSnapshot(...args: unknown[]) {
        console.log('onSnapshot:', args);
        return () => {};
      },
    };
  },

  // Document reference
  doc(...args: unknown[]) {
    console.log('doc:', args);
    const path = args.join('/');
    return {
      ...fakeDocReference,
      path: path,
    };
  },

  // Transaction support
  runTransaction: async (
    updateFn: (transaction: unknown) => Promise<unknown>
  ) => {
    const mockTransaction = {
      get: async (docRef: typeof fakeDocReference) => docRef.get(),
      set: (docRef: typeof fakeDocReference, data: unknown) => {
        console.log('transaction set:', docRef.path, data);
      },
      update: (docRef: typeof fakeDocReference, data: unknown) => {
        console.log('transaction update:', docRef.path, data);
      },
      delete: (docRef: typeof fakeDocReference) => {
        console.log('transaction delete:', docRef.path);
      },
    };
    return updateFn(mockTransaction);
  },

  // Batch operations
  batch: () => ({
    set: (docRef: unknown, data: unknown) => {
      console.log('batch set:', docRef, data);
    },
    update: (docRef: unknown, data: unknown) => {
      console.log('batch update:', docRef, data);
    },
    delete: (docRef: unknown) => {
      console.log('batch delete:', docRef);
    },
    commit: async () => {
      console.log('batch commit');
    },
  }),

  // Utility methods
  settings: () => {},
  clearPersistence: async () => {},
  waitForPendingWrites: async () => {},
  enableNetwork: async () => {},
  disableNetwork: async () => {},
  terminate: async () => {},
  useEmulator: () => {},
};
