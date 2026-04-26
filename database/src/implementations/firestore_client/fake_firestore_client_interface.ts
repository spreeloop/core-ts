const fakeDocReference = {
  get() {
    return {
      ref: {
        path: '',
      },
      data() {
        return {
          key: 'value',
          embedding: [1, 0, 0],
        };
      },
    };
  },
  update(...args: unknown[]) {
    console.log(args);
    return undefined;
  },
  create(...args: unknown[]) {
    console.log(args);
    return undefined;
  },
  set(...args: unknown[]) {
    console.log(args);
    return undefined;
  },
  onSnapshot(...args: unknown[]) {
    console.log(args);
    return function unsubscribe() {
      // Mock unsubscribe function for testing
    };
  },
};

export const fakeFirestoreClientDatabase = {
  collection(...args: unknown[]) {
    console.log(args);
    return {
      id: args[0] as string,
      path: args[0] as string,
      limit(...limitArgs: unknown[]) {
        console.log(limitArgs);
        return this;
      },
      orderBy(...orderArgs: unknown[]) {
        console.log(orderArgs);
        return this;
      },
      where(...whereArgs: unknown[]) {
        console.log(whereArgs);
        return this;
      },
      onSnapshot(...snapshotArgs: unknown[]) {
        console.log(snapshotArgs);
        return function unsubscribe() {
          // Mock unsubscribe function for testing
        };
      },
      add(...addArgs: unknown[]) {
        console.log(addArgs);
        return {
          id: 'newdoc',
          path: `${args[0]}/newdoc`,
        };
      },
      doc(id: string) {
        return {
          id,
          path: `${args[0]}/${id}`,
          get: fakeDocReference.get,
          set: fakeDocReference.set,
          update: fakeDocReference.update,
          onSnapshot: fakeDocReference.onSnapshot,
        };
      },
      get() {
        return {
          docs:
            (this as unknown as { id: string }).id === 'invalid'
              ? []
              : [fakeDocReference.get()],
        };
      },
    };
  },
  collectionGroup(...args: unknown[]) {
    console.log(args);
    return {
      limit(...limitArgs: unknown[]) {
        console.log(limitArgs);
        return this;
      },
      orderBy(...orderArgs: unknown[]) {
        console.log(orderArgs);
        return this;
      },
      where(...whereArgs: unknown[]) {
        console.log(whereArgs);
        return this;
      },
      onSnapshot(...snapshotArgs: unknown[]) {
        console.log(snapshotArgs);
        return function unsubscribe() {
          // Mock unsubscribe function for testing
        };
      },
      get() {
        return {
          docs: [fakeDocReference.get()],
        };
      },
    };
  },
  doc(...args: unknown[]) {
    console.log(args);
    const path = args[0] as string;
    return {
      id: path.split('/').pop(),
      path,
      get: fakeDocReference.get,
      set: fakeDocReference.set,
      update: fakeDocReference.update,
      onSnapshot: fakeDocReference.onSnapshot,
    };
  },
  runTransaction(func: (x: unknown) => unknown) {
    return func({
      get(docRef: typeof fakeDocReference) {
        return docRef.get();
      },
      set(docRef: typeof fakeDocReference) {
        return docRef.set();
      },
      create(docRef: typeof fakeDocReference) {
        return docRef.create();
      },
      update(docRef: typeof fakeDocReference) {
        return docRef.update();
      },
    });
  },
};
