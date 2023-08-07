const fakeDocReference = {
  get(...args: unknown[]) {
    console.log(args);
    return {
      ref: {
        path: '',
      },
      data() {
        return {
          key: 'value',
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
};

export const fakeFirestoreDatabase = {
  collection(...args: unknown[]) {
    console.log(args);
    return {
      limit(...args: unknown[]) {
        console.log(args);
        return this;
      },
      orderBy(...args: unknown[]) {
        console.log(args);
        return this;
      },
      where(...args: unknown[]) {
        console.log(args);
        return this;
      },
      add(...args: unknown[]) {
        console.log(args);
        return {
          path: '',
        };
      },
      get() {
        return {
          docs: [fakeDocReference.get()],
        };
      },
    };
  },
  collectionGroup(...args: unknown[]) {
    return this.collection(args);
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
  doc(...args: unknown[]) {
    console.log(args);
    return fakeDocReference;
  },
};
