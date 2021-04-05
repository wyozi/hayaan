export interface Variable<T> {
  /**
   * Get or set the current dynamic value
   */
  value: T;

  /**
   * Set dynamic value through a deferred function. Value will be set to the given value by calling
   * the given setter only when the correct test scope is reached.
   *
   * This property has no getter!
   */
  deferredValue: () => T;
  // TODO make above writeonly: https://github.com/microsoft/TypeScript/issues/21759
}

const resolveNewValue = <T>(newValue: T | (() => T)): () => T => {
  return typeof newValue === "function" ? (newValue as () => T) : () => newValue;
};

/**
 * Creates a dynamic value
 *
 * @param initializer either a function that will be called to initialize the value or the value itself
 * @returns a dynamic value
 */
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
