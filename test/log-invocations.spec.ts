import { anything, imock, instance, resetStubs, spy, verify, when } from "../src/ts-mockito";

interface Foo {
  getBar(): string;
  getBarWithArg(arg: string): string;
}

describe('log-invocations', () => {
  let c: Console;

  beforeEach(() => {
    c = spy(console);
  });

  afterEach(() => {
    resetStubs(c);
  });

  it("should log invocations of a method", () => {
    const foo: Foo = imock({logInvocations: true});
    instance(foo).getBar();

    verify(foo.getBar()).once();
    verify(c.log("call: getBar()")).once();
  });

  it("should log invocations of a method having behaviors", () => {
    const foo: Foo = imock({logInvocations: true});
    when(foo.getBar()).thenReturn("bar");
    instance(foo).getBar();

    verify(foo.getBar()).once();
    verify(c.log("call: getBar()")).once();
  });

  it("should log invocations of a method with arguments", () => {
    const foo: Foo = imock({logInvocations: true});
    instance(foo).getBarWithArg("hello world");

    verify(foo.getBarWithArg(anything())).once();
    verify(c.log("call: getBarWithArg(\"hello world\")")).once();
  });
});
