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
};

export const fakeFirestoreDatabase = {
  collection(...args: unknown[]) {
    console.log(args);
    return {
      name: args[0] as string,
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
      findNearest(...args: unknown[]) {
        console.log(args);
        return {
          get: () => ({
            docs:
              (this as unknown as { name: string }).name === 'invalid'
                ? []
                : [fakeDocReference.get()],
          }),
        };
      },
      get: () => ({
        docs:
          (this as unknown as { name: string }).name === 'invalid'
            ? []
            : [fakeDocReference.get()],
      }),
    };
  },
  collectionGroup(...args: unknown[]) {
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
      findNearest(...args: unknown[]) {
        console.log(args);
        return {
          get() {
            return {
              docs: [],
            };
          },
        };
      },
      get() {
        return {
          docs:
            (this as unknown as { name: string }).name === 'invalid'
              ? []
              : [fakeDocReference.get()],
        };
      },
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
  doc(...args: unknown[]) {
    console.log(args);
    return fakeDocReference;
  },
};
