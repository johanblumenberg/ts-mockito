import { spy, when } from "../src/ts-mockito";

class Foo {
  method() {
    return "hello world";
  }
}

describe("proceed", () => {
    it("should be possible to invoke the original method", () => {
      const bareObject = new Foo();
      const spiedObject = spy(bareObject);

      when(spiedObject.method()).thenCall(function (...args: any[]) {
          return this.proceed(...args);
      });

      expect(bareObject.method()).toBe("hello world");
    });

    it("should be possible to modify the return value from the original method", () => {
      const bareObject = new Foo();
      const spiedObject = spy(bareObject);

      when(spiedObject.method()).thenCall(function (...args: any[]) {
          return this.proceed(...args) + " modified";
      });

      expect(bareObject.method()).toBe("hello world modified");
    });
  });
