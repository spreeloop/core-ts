import {
  getDatabasePath,
  getDocumentId,
  getOldestParentName,
  getParentCollectionPath,
  getParentDocumentPath,
  isValidCollectionPath,
  isValidDocumentPath,
} from './path_utils';

describe('getDatabasePath', () => {
  it('returns the path to the document', () => {
    expect(getDatabasePath('users', 'user-id')).toEqual('users/user-id');
  });

  it('succeeds on empty collection Id', () => {
    expect(getDatabasePath('', 'user-id')).toEqual('/user-id');
  });

  it('succeeds on empty document Id', () => {
    expect(getDatabasePath('users', '')).toEqual('users/');
  });

  it('succeeds on empty paths', () => {
    expect(getDatabasePath('', '')).toEqual('/');
  });
});

describe('documentId', () => {
  it('returns the ID of the document for a given path', () => {
    expect(getDocumentId('users/user-id')).toEqual('user-id');
  });

  it('returns the ID of the document for a given path', () => {
    expect(getDocumentId('user-id')).toEqual('user-id');
  });

  it('returns undefined when given an empty path', () => {
    expect(getDocumentId('')).toBeFalsy();
  });
});

describe('getOldestParentName', () => {
  it("returns the first parent's name of the document for a given path", () => {
    expect(getOldestParentName('users/user-id')).toEqual('users');
  });

  it('returns undefined when given an invalid path', () => {
    expect(getOldestParentName('users')).toBeUndefined();
  });

  it('returns undefined when given an empty path', () => {
    expect(getOldestParentName('')).toBeUndefined();
  });
});

describe('isValidDocumentPath', () => {
  it('should return true if the document path is valid', () => {
    const response1 = isValidDocumentPath('collection-name/document-id');
    const response2 = isValidDocumentPath(
      'collection-name/document-id/col/doc'
    );
    expect(response1).toBe(true);
    expect(response2).toBe(true);
  });

  it('should return false if the document path is not valid', () => {
    const response = isValidDocumentPath('');
    const response1 = isValidDocumentPath('/id-01');
    const response2 = isValidDocumentPath('collection-name/document-id/');
    expect(response).toBe(false);
    expect(response1).toBe(false);
    expect(response2).toBe(false);
  });
});

describe('isValidCollectionPath', () => {
  it('should returns true if the collection path is valid', () => {
    const response1 = isValidCollectionPath('id-01');
    const response2 = isValidCollectionPath('collection-name/document-id/col');
    expect(response1).toBe(true);
    expect(response2).toBe(true);
  });

  it('should returns false if the collection path is not valid', () => {
    const response = isValidCollectionPath('');
    const response1 = isValidCollectionPath('/id-01');
    const response2 = isValidCollectionPath('collection-name/document-id');
    expect(response).toBe(false);
    expect(response1).toBe(false);
    expect(response2).toBe(false);
  });
});

describe('getParentCollectionPath', () => {
  it('should returns undefined when parent collection is not found.', () => {
    const response1 = getParentCollectionPath('');
    const response2 = getParentCollectionPath('id-01');
    expect(response1).toBeUndefined();
    expect(response2).toBeUndefined();
  });

  it('should returns a valid parent collection path', () => {
    const response1 = getParentCollectionPath('collection/document');
    const response2 = getParentCollectionPath('collection/document/sub-col');
    const response3 = getParentCollectionPath(
      'collection/document/sub-col/sub-doc'
    );
    expect(response1).toBe('collection');
    expect(response2).toBe('collection');
    expect(response3).toBe('collection/document/sub-col');
  });
});

describe('getParentDocumentPath', () => {
  it('should returns undefined when parent document is not found.', () => {
    const response1 = getParentDocumentPath('');
    const response2 = getParentDocumentPath('id-01');
    const response3 = getParentDocumentPath('collection/document');
    expect(response1).toBeUndefined();
    expect(response2).toBeUndefined();
    expect(response3).toBeUndefined();
  });

  it('should returns a valid parent document path', () => {
    const response1 = getParentDocumentPath('collection/document/sub-col');
    const response2 = getParentDocumentPath(
      'collection/document/sub-col/sub-doc'
    );
    expect(response1).toBe('collection/document');
    expect(response2).toBe('collection/document');
  });
});
