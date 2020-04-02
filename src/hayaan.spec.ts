import dyn from "./hayaan";

describe("scoping", () => {
  const dependency = dyn(42);
  const main = dyn(() => dependency.value * 2);

  it("returns initial values in root scope", () => {
    expect(dependency.value).toBe(42);
    expect(main.value).toBe(84);
  });

  describe("when scoped", () => {
    describe("and dependency is edited", () => {
      dependency.value = 10;

      it("affects both", () => {
        expect(dependency.value).toBe(10);
        expect(main.value).toBe(20);
      });
    });
    describe("and main is edited", () => {
      main.deferredValue = () => dependency.value - 2;

      it("affects both", () => {
        expect(dependency.value).toBe(42);
        expect(main.value).toBe(40);
      });
    });
    describe("and both are edited", () => {
      dependency.value = 100;
      main.deferredValue = () => dependency.value + 12;

      it("affects both", () => {
        expect(dependency.value).toBe(100);
        expect(main.value).toBe(112);
      });
    });
  });

  it("returns initial values again in root scope", () => {
    expect(dependency.value).toBe(42);
    expect(main.value).toBe(84);
  });
});
