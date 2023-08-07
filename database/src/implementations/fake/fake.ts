import { QueryFilter } from '../../utils/query_filter';
import {
  Database,
  DatabaseDocument,
  DatabaseTransaction,
  GetCollectionGroupRequest,
  GetCollectionRequest,
} from '../../database';
import {
  getDocumentId,
  getParentCollectionPath,
  isValidCollectionPath,
  isValidDocumentPath,
} from '../../utils/path_utils';

type OnValueCallback = (
  collectionPath: string,
  value: Record<string, unknown>
) => void;

/**
 * Creates a deepClone of a provided object.
 * @param {T} doc The object to clone.
 * @return {T} A clone value of the provided object
 */
function deepClone<T = unknown>(doc: T): T {
  return JSON.parse(
    JSON.stringify(doc, function (_, value) {
      if (value !== value) {
        return 'NaN';
      }
      return value;
    }),
    function (_, value) {
      if (value === 'NaN') {
        return NaN;
      }
      return value;
    }
  );
}

/**
 * Checks if the provided map is a valid collection.
 * @param {T} data The map that we want to validate as collection.
 * @return {boolean}
 */
function isValidCollection<T = unknown>(data: T): boolean {
  if (
    typeof data != 'object' ||
    (data as Record<string, unknown>).constructor != Object
  ) {
    return false;
  }
  const values = Object.values(data as Record<string, unknown>);
  for (const document of values) {
    // Only null can be considered as a valid document.
    if (document == null) {
      continue;
    }
    // All order falsy value can be considered as a valid document.
    if (!document) {
      return false;
    }

    // All truthy values that is not an object can't be considered as a valid document.
    if (typeof document != 'object' || document?.constructor != Object) {
      return false;
    }
  }
  return true;
}

/**
 * Sorts objects by property.
 * @param {T[]} arr The array of object.
 * @param {string} property The property ordering.
 * @param {boolean} descending True when sorting should be descending.
 * @return {T[]} The array of object already sort.
 */
function sortByProperty<T = unknown>(
  arr: DatabaseDocument<T>[],
  property: keyof T,
  descending: boolean
): DatabaseDocument<T>[] {
  return arr.sort(function (objA, objB) {
    const objC = Object(objA.data)[property];
    const objD = Object(objB.data)[property];

    if (objC == objD) return 0;
    return descending ? (objD > objC ? 1 : -1) : objD < objC ? 1 : -1;
  });
}

/**
 * Recursively find a collection with a given name [collectionID] in the given map.
 * @param {Record<string, unknown>} currentMap The map where we want to find a sub collection.
 * @param {string} parentPath The parent document path
 * @param {string} collectionID The name of the collection whe wan to find.
 * @param {OnValueCallback} onValueCallback A callback
 * method to call when we found a matching collection.
 * @return {void}
 */
function recursivelyFindCollection(
  currentMap: Record<string, unknown>,
  parentPath: string,
  collectionID: string,
  onValueCallback: OnValueCallback
): void {
  if (
    !(
      isValidDocumentPath(parentPath) ||
      isValidCollectionPath(parentPath) ||
      parentPath === ''
    )
  ) {
    return;
  }
  for (const [key, value] of Object.entries(currentMap)) {
    const expectedCollectionPath =
      parentPath === '' ? key : `${parentPath}/${key}`;
    if (value instanceof Object && value.constructor === Object) {
      if (
        key == collectionID &&
        isValidCollectionPath(expectedCollectionPath) &&
        isValidCollection(value)
      ) {
        Object.entries(value).forEach(([childKey, childValue]) => {
          onValueCallback(
            `${expectedCollectionPath}/${childKey}`,
            deepClone(childValue)
          );
        });
        break;
      }
      recursivelyFindCollection(
        value as Record<string, unknown>,
        expectedCollectionPath,
        collectionID,
        onValueCallback
      );
    }
  }
}

/**
 * Verifies if the provided data match all given filter.
 * @param {QueryFilter[]} filters The list of filter we wan apply.
 * @param {Record<string, unknown>} value The data to check.
 * @return {boolean} true if the value match the filter and false other wise.
 */
function allFiltersMatch(
  filters: QueryFilter[],
  value: Record<string, unknown>
): boolean {
  for (const docQuery of filters) {
    const condition = docQuery.opStr;
    const valueData = value[docQuery.fieldPath];
    const comparableData = valueData as string | number;
    if (
      (condition == '==' &&
        !(docQuery.value instanceof Array) &&
        comparableData == docQuery.value) ||
      (condition == '>' &&
        !(docQuery.value instanceof Array) &&
        comparableData > docQuery.value) ||
      (condition == '>=' &&
        !(docQuery.value instanceof Array) &&
        comparableData >= docQuery.value) ||
      (condition == '<' &&
        !(docQuery.value instanceof Array) &&
        comparableData < docQuery.value) ||
      (condition == '<=' &&
        !(docQuery.value instanceof Array) &&
        comparableData <= docQuery.value) ||
      (condition == '!=' &&
        !(docQuery.value instanceof Array) &&
        comparableData != docQuery.value) ||
      (condition == 'in' &&
        docQuery.value instanceof Array &&
        docQuery.value.indexOf(comparableData.toString()) !== -1)
    ) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Fake implementation of Database.
 */
export class FakeDatabase implements Database {
  /**
   * Constructs a new Fake database implementation.
   * @param {Record<string, Record<string, unknown>>} rawData
   */
  constructor(private rawData: Record<string, Record<string, unknown>>) {}

  /**
   * Find object at the given path.
   * @param {string} path The path provided.
   * @private
   * @return {Record<string, unknown> | undefined} a record if found.
   */
  private getRawData(path: string): Record<string, unknown> | undefined {
    const pathSegments = path.trim().split('/');
    return pathSegments.reduce<Record<string, unknown> | undefined>(
      (previousRawData, pathName) => {
        return previousRawData?.constructor == Object
          ? (previousRawData[pathName] as Record<string, unknown> | undefined)
          : undefined;
      },
      this.rawData
    );
  }

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
    if (!isValidCollectionPath(collectionPath)) {
      return;
    }
    const collection = this.getRawData(collectionPath);
    if (!collection) {
      return;
    }
    const recordId = Object.keys(collection).length + 1;
    const idDocument = `${getDocumentId(collectionPath)}_${recordId}`;
    const documentPath = `${getDocumentId(collectionPath)}/${idDocument}`;
    collection[idDocument] = data;
    return documentPath;
  }

  /**
   * Creates a database document with the given path.
   * @param {string} path The database path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {string | undefined} The path of document create.
   */
  async createRecordInTransaction<T = unknown>(
    path: string,
    data: T
  ): Promise<string | undefined> {
    const collectionPath = getParentCollectionPath(path);
    const idDocument = getDocumentId(path);
    if (
      !collectionPath ||
      !idDocument ||
      !isValidDocumentPath(path) ||
      (data && data.constructor != Object)
    ) {
      return;
    }

    const collection = this.getRawData(collectionPath);
    if (!collection) {
      return;
    }

    collection[idDocument] = data;
    return path;
  }

  /**
   * Creates or update a database document with the given path.
   * @param {string} path The database path to the document.
   * @param {Partial<Object>} data The database path to the document.
   * @return {boolean} The operation status.
   */
  async setRecord<T = unknown>(
    path: string,
    data: Partial<T>
  ): Promise<boolean> {
    const collectionPath = getParentCollectionPath(path);
    const idDocument = getDocumentId(path);
    if (
      !collectionPath ||
      !idDocument ||
      !isValidDocumentPath(path) ||
      (data && data.constructor != Object)
    ) {
      return false;
    }

    const doc = this.getRawData(path);
    if (doc) {
      for (const [key, value] of Object.entries(data)) {
        doc[key] = value;
      }
      return true;
    }

    const collection = this.getRawData(collectionPath);
    if (!collection) {
      return false;
    }

    collection[idDocument] = data;
    return true;
  }

  /**
   * Returns the document at the corresponding path.
   * @param {string} path The database path to the document.
   * @return {Object | undefined} The document data.
   */
  async getRecord<T = unknown>(
    path: string
  ): Promise<DatabaseDocument<T | undefined>> {
    if (!isValidDocumentPath(path)) {
      return {
        path,
        data: undefined,
      };
    }

    const doc = this.getRawData(path);
    if (doc?.constructor !== Object) {
      return {
        path,
        data: undefined,
      };
    }
    const data = doc as T;
    return { data: deepClone(data) as T, path };
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
    filters = [],
    transform = ({ path, data }) => ({ path, data } as unknown as R),
  }: GetCollectionGroupRequest<T, R>): Promise<R[]> {
    const originalDocs: Record<string, T> = {};

    recursivelyFindCollection(
      this.rawData,
      '',
      collectionId,
      (documentPath, value) => {
        if (allFiltersMatch(filters, value)) {
          originalDocs[documentPath] = value as T;
        }
      }
    );

    const entries = Object.entries(originalDocs);
    let values: DatabaseDocument<T>[] = [];
    for (const [documentPath, document] of entries) {
      values.push({ data: deepClone(document) as T, path: documentPath });
    }
    if (orderBy) {
      values = sortByProperty(
        deepClone(values),
        orderBy.field,
        orderBy.descending
      );
    }
    if (limit) {
      values = values.slice(0, limit);
    }
    return values.map(transform);
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
    const collection = this.getRawData(collectionPath) as
      | Record<string, string>
      | undefined;
    if (!collection || !isValidCollection(collection)) {
      return [];
    }
    const entries = Object.entries(collection);
    const value = [];
    for (const [documentId] of entries) {
      value.push(documentId);
    }

    return deepClone(value);
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
    filters = [],
    limit,
    orderBy,
    transform = ({ path, data }) => ({ path, data } as unknown as R),
  }: GetCollectionRequest<T, R>): Promise<R[]> {
    if (!isValidCollectionPath(collectionPath)) {
      return [];
    }
    const collection = this.getRawData(collectionPath) as
      | Record<string, T>
      | undefined;
    if (!collection || !isValidCollection(collection)) {
      return [];
    }
    const entries = Object.entries(collection);
    let values: DatabaseDocument<T>[] = [];
    for (const [documentId, document] of entries) {
      if (allFiltersMatch(filters, document as Record<string, unknown>)) {
        values.push({
          data: document,
          path: `${collectionPath}/${documentId}`,
        });
      }
    }

    if (orderBy) {
      values = sortByProperty(
        deepClone(values),
        orderBy.field,
        orderBy.descending
      );
    }
    if (limit) {
      values = values.slice(0, limit);
    }
    return values.map(transform);
  }

  /**
   * Creates a new Database transaction.
   * @param {Function} handler A transaction function to call.
   * NOTE: The handler should be [idempotent](https://en.wikipedia.org/wiki/Idempotence).
   * Assume that it will be called more than once, because concurrent database writes may cause a retry.
   * @return {Promise<T>}
   */
  runTransaction<T>(
    handler: (data: DatabaseTransaction) => Promise<T>
  ): Promise<T> {
    return handler({
      createRecord: this.createRecordInTransaction.bind(this),
      setRecord: this.setRecord.bind(this),
      getRecord: this.getRecord.bind(this),
      updateRecord: this.setRecord.bind(this),
      getCollection: this.getCollection.bind(this),
    });
  }
}

export const exportedForTesting = {
  deepClone,
  isValidCollection,
  recursivelyFindCollection,
  allFiltersMatch,
};
