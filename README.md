# hayaan

Ruby's RSpec-inspired scoped lazy variables for Jest, with native TypeScript support.

**Installation**

`yarn install --dev hayaan`

**Usage**

```js
import dyn from "hayaan";

const sum = (a, b) => a + b;

describe("implementation", () => {
  const a = dyn(5);
  const b = dyn(3);
  const total = dyn(() => sum(a.value, b.value));

  it("sums up", () => expect(total.value).toEqual(8));
  
  describe("with b changed", () => {
    b.value = 10;
    it("sums up", () => expect(total.value).toEqual(15));
  })

  describe("with both changed", () => {
    a.value = 1;
    b.value = -2;
    it("still sums up", () => expect(total.value).toEqual(-1));
  });

  describe("with even the function changed", () => {
    total.deferredValue = () => sum(-a.value, b.value);
    it("uses the new function", () => expect(total.value).toEqual(-2));
    
    describe("and a changed", () => {
      a.value = 1;
      it("uses the right values", () => expect(total.value).toEqual(2));
    })
  });
})
```

### Debugging

- Make sure `<variable>.value = ...` calls are **outside** the `it` blocks
  - _hayaan uses beforeEach and afterEach under the hood, which only work on higher level than individual tests_
