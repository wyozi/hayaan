import dyn from "./hayaan";

describe("scoping", () => {
  const dependency = dyn(42);
  const main = dyn(() => dependency.value * 2);

  it("returns initial values in root scope", () => {
    expect(dependency.value).toBe(42);
    expect(main.value).toBe(84);
  });

  describe("when sub-scoped", () => {
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

describe("async scoping", () => {
  const arg0 = dyn("foo")
  const arg1 = dyn(15)

  const instance = dyn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
    return `${arg0.value} // ${arg1.value}`
  })

  it("resolves in root scope", async () => {
    expect(await instance.value).toEqual("foo // 15")
  })

  describe("when sub-scoped", () => {
    arg0.value = "bar"
    arg1.deferredValue = () => -51

    it("resolves the correct values", async () => {
      expect(await instance.value).toEqual("bar // -51")
    })
  })
})

describe("same-level scope dependencies", () => {
  const baseDep = dyn(() => Math.random())

  const levelDep1 = dyn(() => baseDep.value)
  const levelDep2 = dyn(() => baseDep.value)

  it("level deps should resolve to the same value", () => {
    expect(levelDep1.value === levelDep2.value).toBe(true)
  })

  describe('in first sub-scope', () => {
    const levelDep1 = dyn(() => baseDep.value)
    const levelDep2 = dyn(() => baseDep.value)

    it("level deps should resolve to the same value", () => {
      expect(levelDep1.value === levelDep2.value).toBe(true)
    })

    describe('in second sub-scope and changed base dep', () => {
      baseDep.deferredValue = () => Math.random() * 2

      it("parent level-deps should equal basedep", () => {
        expect(levelDep1.value === baseDep.value).toBe(true)
      })

      it("parent level-deps should resolve to the same value", () => {
        expect(levelDep1.value === levelDep2.value).toBe(true)
      })
    })
  })
})