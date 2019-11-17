export interface Variable<T> {
  (): T;
  set: (newInitializer: () => T) => void;
}

export default function dyn<T>(initializer: () => T): Variable<T> {
  let scope: () => T = initializer;

  const value = function() {
    return scope();
  };
  value.set = function setter(newInitializer: () => T) {
    let old: () => T;
    beforeEach(() => {
      old = scope;
      scope = newInitializer;
    });
    afterEach(() => {
      scope = old;
    });
  };
  return value;
}
