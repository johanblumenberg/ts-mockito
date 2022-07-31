import { instance, mock, spy, when } from "../src/ts-mockito";

interface Foo {
  arrowFunctionMethod: () => string;
  calculatedMethodTS435: () => string;
  calculatedMethodTS442: () => string;
  calculatedPropertyTS435: string;
  calculatedPropertyTS442: string;
}

type FooConstructor = new() => Foo;

const dep = { identity: (x: any) => x };

// The purpose is to be able to test the exact code that different versions
// of typescript generate. Using eval() to prevent typescript from compiling
// this code and change it.
// tslint:disable-next-line no-eval
const Foo: FooConstructor = eval(`
  function Foo() {
    /*
     * Consider this class:
     *
     * class Foo {
     *   public bar = () => 5
     * }
     *
     * Typescript compiles into:
     *
     * function Foo() {
     *   this.bar = function () { return 5; }
     * }
     */
    this.arrowFunctionMethod = function () { return "original" };

    /*
     * Consider this class:
     *
     * class Foo {
     *   public bar = dep.identity(() => 5)
     * }
     *
     * Typescript 4.3.5 compiles into:
     *
     * function Foo() {
     *   this.bar = dep_1.identity(function () { return 5; });
     * }
     *
    * Typescript 4.4.2 compiles into:
    *
    * function Foo() {
    *   this.bar = (0, dep_1).identity(function () { return 5; });
    * }
    */
    this.calculatedMethodTS435 = dep.identity(function () { return "original"; });
    this.calculatedMethodTS442 = (0, dep.identity)(function () { return "original"; });

   /*
     * Consider this class:
     *
     * import { identity } from 'dep';
     * class Foo {
     *   public bar: number = dep.identity(5)
     * }
     *
     * Typescript 4.3.5 compiles into:
     *
     * function Foo() {
     *   this.bar = dep_1.identity(5)
     * }
     *
     * Typescript 4.4.2 compiles into:
     *
     * function Foo() {
     *   this.bar = (0, dep_1.identity)(5)
     * }
     */
    this.calculatedPropertyTS435 = dep.identity("original");
    this.calculatedPropertyTS442 = (0, dep.identity)("original");
  }

  Foo
`);

describe("Dynamic methods", () => {
  describe("Mocking a class", () => {
    it("should return the mocked value when an expectation is set, arrow function", () => {
      // given
      const foo: Foo = mock(Foo);
      when(foo.arrowFunctionMethod()).thenReturn("value");

      // then
      expect(instance(foo).arrowFunctionMethod()).toBe("value");
    });

    it("should return the mocked value when an expectation is set, assigned function TS435", () => {
      // given
      const foo: Foo = mock(Foo);
      when(foo.calculatedMethodTS435()).thenReturn("value");

      // then
      expect(instance(foo).calculatedMethodTS435()).toBe("value");
    });

    it("should return the mocked value when an expectation is set, assigned function TS442", () => {
      // given
      const foo: Foo = mock(Foo);
      when(foo.calculatedMethodTS442()).thenReturn("value");

      // then
      expect(instance(foo).calculatedMethodTS442()).toBe("value");
    });

    it("should return null when no expectation is set, arrow function", () => {
      // given
      const foo: Foo = mock(Foo);

      // then
      expect(instance(foo).arrowFunctionMethod()).toBeNull();
    });

    // constructor code parsing wrongly assumes property
    xit("should return null when no expectation is set, assigned function TS435", () => {
      // given
      const foo: Foo = mock(Foo);

      // then
      expect(instance(foo).calculatedMethodTS435()).toBeNull();
    });

    it("should return null when no expectation is set, assigned function TS442", () => {
      // given
      const foo: Foo = mock(Foo);

      // then
      expect(instance(foo).calculatedMethodTS442()).toBeNull();
    });
  });

  describe("Spying on an object", () => {
    it("should return the mocked value when an expectation is set, arrow function", () => {
      // given
      const foo: Foo = spy(new Foo());
      when(foo.arrowFunctionMethod()).thenReturn("value");

      // then
      expect(instance(foo).arrowFunctionMethod()).toBe("value");
    });

    it("should return the mocked value when an expectation is set, assigned function TS435", () => {
      // given
      const foo: Foo = spy(new Foo());
      when(foo.calculatedMethodTS435()).thenReturn("value");

      // then
      expect(instance(foo).calculatedMethodTS435()).toBe("value");
    });

    it("should return the mocked value when an expectation is set, assigned function TS442", () => {
      // given
      const foo: Foo = spy(new Foo());
      when(foo.calculatedMethodTS442()).thenReturn("value");

      // then
      expect(instance(foo).calculatedMethodTS442()).toBe("value");
    });

    it("should return original value when no expectation is set, arrow function", () => {
      // given
      const foo: Foo = spy(new Foo());

      // then
      expect(instance(foo).arrowFunctionMethod()).toBe("original");
    });

    it("should return original value when no expectation is set, assigned function TS435", () => {
      // given
      const foo: Foo = spy(new Foo());

      // then
      expect(instance(foo).calculatedMethodTS435()).toBe("original");
    });

    it("should return original value when no expectation is set, assigned function TS442", () => {
      // given
      const foo: Foo = spy(new Foo());

      // then
      expect(instance(foo).calculatedMethodTS442()).toBe("original");
    });
  });
});

describe("Dynamic properties", () => {
  describe("Mocking a class", () => {
    it("should return the mocked value when an expectation is set, TS435", () => {
      // given
      const foo: Foo = mock(Foo);
      when(foo.calculatedPropertyTS435).thenReturn("value");

      // then
      expect(instance(foo).calculatedPropertyTS435).toBe("value");
    });

    it("should return the mocked value when an expectation is set. TS442", () => {
      // given
      const foo: Foo = mock(Foo);
      when(foo.calculatedPropertyTS442).thenReturn("value");

      // then
      expect(instance(foo).calculatedPropertyTS442).toBe("value");
    });

    it("should return null when no expectation is set, TS435", () => {
      // given
      const foo: Foo = mock(Foo);

      // then
      expect(instance(foo).calculatedPropertyTS435).toBeNull();
    });

    // constructor code parsing wrongly assumes method
    xit("should return null when no expectation is set, TS442", () => {
      // given
      const foo: Foo = mock(Foo);

      // then
      expect(instance(foo).calculatedPropertyTS442).toBeNull();
    });
  });

  describe("Spying on an object", () => {
    // Not possible to set expectations on properties on a mock
    xit("should return the mocked value when an expectation is set, TS435", () => {
      // given
      const foo: Foo = spy(new Foo());
      when(foo.calculatedPropertyTS435).thenReturn("value");

      // then
      expect(instance(foo).calculatedPropertyTS435).toBe("value");
    });

    // Not possible to set expectations on properties on a mock
    xit("should return the mocked value when an expectation is set. TS442", () => {
      // given
      const foo: Foo = spy(new Foo());
      when(foo.calculatedPropertyTS442).thenReturn("value");

      // then
      expect(instance(foo).calculatedPropertyTS442).toBe("value");
    });

    it("should return original when no expectation is set, TS435", () => {
      // given
      const foo: Foo = spy(new Foo());

      // then
      expect(instance(foo).calculatedPropertyTS435).toBe("original");
    });

    it("should return original when no expectation is set, TS442", () => {
      // given
      const foo: Foo = spy(new Foo());

      // then
      expect(instance(foo).calculatedPropertyTS442).toBe("original");
    });
  });
});
