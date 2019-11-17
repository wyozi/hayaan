# hayaan

"Lexically" scoped lazy variables for Jest tests with native TypeScript support.

**Installation**

- `yarn install --dev <todo>`
- `import dyn from "hayaan"`
- See [recipes](#recipes)

**Why?**

Many tests (especially using Enzyme/React) suffer from code bloat due to the need to edit props in an upper level component.

Traditional solutions to this include using `component.setProps`, pure functions accepting partial overriding props on top level or just copypasting component creation code.

```js
// Example of using component.setProps
describe("my test", () => {
  let component;
  beforeEach(() => (component = renderComponentSomehow()));

  describe("with specific properties set", () => {
    beforeEach(() => component.setProps({ bla }));
    it("works", () => expect(component).toWork());
  });
});
```

The issue with these methods is that they quickly become either bloated or overly complicated. This problem has been solved in Ruby with RSpec's [`let` method](https://medium.com/@tomkadwill/all-about-rspec-let-a3b642e08d39). Hayaan brings similar solution to statically typed TypeScript (i.e. [given2](https://github.com/tatyshev/given2) for TypeScript).

### Recipes

**Very simple**

```js
import dyn from "hayaan";
describe("my test", () => {
  const myValue = dyn(() => 10);

  it("returns initial value on root level", () => {
    expect(myValue()).toBe(10);
  });

  describe("within block", () => {
    myValue.set(() => 20);
    it("returns updated value", () => {
      expect(myValue()).toBe(20);
    });
  });
});
```

**Slightly more complex**

```js
import dyn from "hayaan";
describe("my test", () => {
  const fuzzlepoki = dyn(() => 15);
  const punotek = dyn(() => ["a", "b"]);

  const execute = () => myFuzzlePokiPunoTeker(fuzzlepoki(), punotek());

  it("works with default parameters", () => {
    expect(execute()).toBe(4040);
  });

  describe("with extra large fuzzlepoki", () => {
    fuzzlepoki.set(() => 24);
    it("returns larger value", () => {
      expect(execute()).toBe(8302);
    });

    describe("and emojified punotek", () => {
      punotek.set(() => ["😊", "⛰️"]);
      it("returns emojified value", () => {
        // note: fuzzlepoki is still 24 during this call
        expect(execute()).toBe(8509);
      });
    });
  });
});
```

**Jest + Enzyme**

```js
import dyn from "hayaan";
describe("my component", () => {
  const text = dyn(() => "foo bar");
  const fontSize = dyn(() => 24);
  const component = dyn(() =>
    shallow(<TextNode fontSize={fontSize()}>{text()}</TextNode>)
  );

  it("renders", () => {
    expect(component().exists()).toBe(true);
  });

  describe("with empty string", () => {
    text.set("");

    it("renders placeholder", () => {
      expect(
        component()
          .find("Placeholder")
          .exists()
      ).toBe(true);
      expect(
        component()
          .find("Placeholder")
          .text()
      ).toEqual("No content yet");
    });
  });
});
```

### Debugging

- Make sure `<variable>.set()` calls are **outside** the `it` blocks
  - _hayaan uses beforeEach and afterEach under the hood, which only work on higher level than individual tests_
- Always call the (`<variable>()`) rather than using it directly (`<variable>`)
  - _using it directly will just give you a function, which does not do anything alone_
