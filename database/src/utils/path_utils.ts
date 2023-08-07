/**
 * Returns a the corresponding database path.
 * @param {string} collectionId The ID or name of the collection.
 * @param {string} documentId The ID of the document.
 * @return {string} The full database path of the document.
 */
export function getDatabasePath(
  collectionId: string,
  documentId: string
): string {
  return `${collectionId}/${documentId}`;
}

/**
 * Returns the ID of the document.
 * @param {string} path The path of the document.
 * @return {string} The ID of the document.
 */
export function getDocumentId(path: string): string {
  const segments = path.split('/');
  return segments[segments.length - 1];
}

/**
 * Returns the first parent's name of the document.
 * @param {string} path The path of the document.
 * @return {string} The first parent's name of the document.
 */
export function getOldestParentName(path: string): string | undefined {
  if (!isValidDocumentPath(path)) return;
  const segments = path.split('/');
  return segments[0];
}

/**
 * Checks if the provided path is a valid document path.
 * @param {string} path the document path.
 * @return {boolean}
 */
export function isValidDocumentPath(path: string): boolean {
  const minimumValidPathSegmentLength = 2;
  const pathSegments = path.trim().split('/');
  if (pathSegments.length < minimumValidPathSegmentLength) {
    return false;
  }
  const remainder = pathSegments.length % minimumValidPathSegmentLength;
  if (remainder != 0) {
    return false;
  }
  const documentId = pathSegments.pop();
  if (!pathSegments[0] || !documentId) {
    return false;
  }
  return true;
}

/**
 * Checks if the provided path is a valid collection path.
 * @param {string} path the collection path.
 * @return {boolean}
 */
export function isValidCollectionPath(path: string): boolean {
  if (path.length < 1) {
    return false;
  }
  const pathSegments = path.trim().split('/');
  if (pathSegments.length == 1 && pathSegments[0]) {
    return true;
  }
  const remainder = pathSegments.length % 3;

  return remainder == 0;
}

/**
 * Returns the parent collection path of the provided entity path.
 * @param {string} path the data path.
 * @return {string | undefined}
 */
export function getParentCollectionPath(path: string): string | undefined {
  if (isValidCollectionPath(path)) {
    const pathSegments = path.split('/');
    pathSegments.pop();
    pathSegments.pop();
    const parentCollection = pathSegments.join('/');
    return isValidCollectionPath(parentCollection)
      ? parentCollection
      : undefined;
  }
  if (isValidDocumentPath(path)) {
    const pathSegments = path.split('/');
    pathSegments.pop();
    const parentCollection = pathSegments.join('/');
    return parentCollection;
  }
  return undefined;
}

/**
 * Returns the parent document path of the provided entity path.
 * @param {string} path the data path.
 * @return {string | undefined}
 */
export function getParentDocumentPath(path: string): string | undefined {
  if (isValidCollectionPath(path)) {
    const pathSegments = path.split('/');
    pathSegments.pop();
    return pathSegments.join('/') || undefined;
  }
  if (isValidDocumentPath(path)) {
    const pathSegments = path.split('/');
    pathSegments.pop();
    pathSegments.pop();
    return pathSegments.join('/') || undefined;
  }
  return undefined;
}
