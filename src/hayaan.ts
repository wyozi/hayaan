export interface Variable<T> {
  /**
   * Get or set the dynamic value for the next Jest context block
   */
  value: T;

  /**
   * Set dynamic value through a deferred function. Given function will only be called to retrieve the value
   * when something wants to use the value, i.e. calls `.value` on this Variable or this Variable's dependent
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

  let wasResolved = false;
  let resolved: T;

  beforeEach(() => {
    wasResolved = false;
  })

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
      if (!wasResolved) {
        resolved = scope();
        wasResolved = true;
      }
      return resolved;
    },
    set value(newValue: T) {
      setter(() => newValue);
    },
    set deferredValue(newDeferredValue: () => T) {
      setter(newDeferredValue);
    }
  };
}
