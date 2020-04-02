export interface Variable<T> {
  value: T;
  deferredValue: () => T;
}

const resolveNewValue = <T>(newValue: T | (() => T)): () => T => {
  return typeof newValue === "function" ? (newValue as () => T) : () => newValue;
};

export default function dyn<T>(initializer: T | (() => T)): Variable<T> {
  let scope: () => T = resolveNewValue(initializer);

  function setter(newInitializer: () => T) {
    let old: () => T;
    beforeEach(() => {
      old = scope;
      scope = newInitializer;
    });
    afterEach(() => {
      scope = old;
    });
  };
  return {
    get value(): T {
      return scope();
    },
    set value(newValue: T) {
      setter(() => newValue);
    },
    set deferredValue(newDeferredValue: () => T) {
      setter(newDeferredValue);
    }
  };
}
