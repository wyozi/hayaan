import dyn from "./hayaan";

describe("scoping", () => {
  const dependency = dyn(() => 42);
  const main = dyn(() => dependency() * 2);

  it("returns initial values in root scope", () => {
    expect(dependency()).toBe(42);
    expect(main()).toBe(84);
  });

  describe("when scoped", () => {
    describe("and dependency is edited", () => {
      dependency.set(() => 10);

      it("affects both", () => {
        expect(dependency()).toBe(10);
        expect(main()).toBe(20);
      });
    });
    describe("and main is edited", () => {
      main.set(() => dependency() - 2);

      it("affects both", () => {
        expect(dependency()).toBe(42);
        expect(main()).toBe(40);
      });
    });
    describe("and both are edited", () => {
      dependency.set(() => 100);
      main.set(() => dependency() + 12);

      it("affects both", () => {
        expect(dependency()).toBe(100);
        expect(main()).toBe(112);
      });
    });
  });

  it("returns initial values again in root scope", () => {
    expect(dependency()).toBe(42);
    expect(main()).toBe(84);
  });
});
