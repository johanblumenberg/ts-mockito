import {capture, reset, resetStubs, spy, verify, when} from "../src/ts-mockito";

describe("spying on a real object", () => {
    class Real {
        public b = 11;

        public foo(a: number) {
            return a;
        }

        public bar() {
            return 2;
        }

        get baz() {
            return 3;
        }
    }

    function RealFn() {

    }

    describe("calling a mocked method", () => {
        it("delegates a call to the mock", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.bar()).thenReturn(3);

            // then
            expect(foo.bar()).toBe(3);
        });

        it("executes the real method if arguments don't match", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.foo(1)).thenReturn(42);

            // then
            expect(foo.foo(2)).toBe(2);
        });
    });

    describe("calling a real method", () => {
        it("executes the instance method", () => {
            // given
            const foo = new Real();

            // when
            spy(foo);

            // then
            expect(foo.bar()).toBe(2);
        });
    });

    describe("calling an object's own method", () => {
        it("delegates a call to the mock", () => {
            // given
            const foo = {
                bar: () => 3,
            };
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.bar()).thenReturn(42);

            // then
            expect(foo.bar()).toBe(42);
        });
    });

    describe("spying functions", () => {
        it("should not mock function.prototype methods", () => {
          // when
          spy(RealFn);

          expect(RealFn.bind).toBe(Function.prototype.bind);
          expect(RealFn.apply).toBe(Function.prototype.apply);
        });
    });

    describe("access to a real object property", () => {
        it("get instance property", () => {
          // given
          const foo = new Real();

          // when
          spy(foo);

          // then
          expect(foo.b).toBe(11);
        });
    });

    describe("capturing", () => {
        it("captures a call to the real method", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            foo.bar();

            // then
            expect(capture(spiedFoo.bar).last()).toBeDefined();
        });

        it("captures the call arguments", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            foo.foo(42);

            // then
            expect(capture<number>(spiedFoo.foo).last()).toEqual([42]);
        });

        it("captures a call to the own property", () => {
            // given
            const foo = {
                bar: a => a,
            };
            const spiedFoo = spy(foo);

            // when
            foo.bar(42);

            // then
            expect(capture<number>(spiedFoo.bar).last()).toEqual([42]);
        });
    });

    describe("verifying calls", () => {
        it("throws an error if number of calls doesn't match", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            foo.bar();
            foo.bar();

            // then
            expect(() => verify(spiedFoo.bar()).once()).toThrow();
        });

        describe("when foo() is called before bar()", () => {
            it("throws an error if expected foo() to have been called after bar()", () => {
                // given
                const foo = new Real();
                const spiedFoo = spy(foo);

                // when
                foo.foo(1);
                foo.bar();

                // then
                expect(() => verify(spiedFoo.foo(1)).calledAfter(spiedFoo.bar())).toThrow();
            });

            it("passes if expected foo() to have been before after bar()", () => {
                // given
                const foo = new Real();
                const spiedFoo = spy(foo);

                // when
                foo.foo(1);
                foo.bar();

                // then
                expect(() => verify(spiedFoo.foo(1)).calledBefore(spiedFoo.bar())).not.toThrow();
            });
        });
    });

    describe("resetting", () => {
        it("restores a call to the real method", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.bar()).thenReturn(3);
            reset(spiedFoo);

            // then
            expect(foo.bar()).toBe(2);
        });

        it("cleans up not owned property descriptors", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.baz).thenReturn(42);
            reset(spiedFoo);

            // then
            expect(Object.getOwnPropertyDescriptor(foo, "baz")).not.toBeDefined();
        });

        it("restores getter properties", () => {
            // given
            const foo = new Real();
            const spiedFoo = spy(foo);

            // when
            when(spiedFoo.baz).thenReturn(42);
            reset(spiedFoo);

            // then
            expect(foo.baz).toBe(3);
        });
    });

    describe("resetting stubs", () => {
      it("restores a call to the real method", () => {
          // given
          const foo = new Real();
          const spiedFoo = spy(foo);

          // when
          when(spiedFoo.bar()).thenReturn(3);
          resetStubs(spiedFoo);

          // then
          expect(foo.bar()).toBe(2);
      });

      it("set new stub calls to the real method", () => {
        // given
        const foo = new Real();
        const spiedFoo = spy(foo);

        // when
        when(spiedFoo.bar()).thenReturn(3);
        resetStubs(spiedFoo);
        when(spiedFoo.bar()).thenReturn(4);

        // then
        expect(foo.bar()).toBe(4);
    });

    it("restores getter properties", () => {
          // given
          const foo = new Real();
          const spiedFoo = spy(foo);

          // when
          when(spiedFoo.baz).thenReturn(42);
          resetStubs(spiedFoo);

          // then
          expect(foo.baz).toBe(3);
      });

      it("set new stub properties", () => {
        // given
        const foo = new Real();
        const spiedFoo = spy(foo);

        // when
        when(spiedFoo.baz).thenReturn(42);
        resetStubs(spiedFoo);
        when(spiedFoo.baz).thenReturn(43);

        // then
        expect(foo.baz).toBe(43);
    });
  });

    describe("spying on object which doesn't inherit from anything", () => {
        let bareObject;

        beforeEach(() => {
            bareObject = Object.create(null, {
                someMethod: {
                    writable: true,
                    configurable: true,
                    value: () => 1,
                },
                otherMethod: {
                    writable: true,
                    configurable: true,
                    value: () => 2,
                },
            });
        });

        it("can be spied (doesn't throw an exception)", () => {
            // given

            // when
            spy(bareObject);

            // then
        });

        it("executes the instance method", () => {
            // given

            // when
            spy(bareObject);

            // then
            expect(bareObject.otherMethod()).toBe(2);
        });

        it("can spy on object which access internal setter and getter", () => {
            // igven
            class X {
                private internal: number = 0;

                public get x() {
                    return this.internal;
                }

                public set x(value: number) {
                    this.internal = value;
                }

                public method(value: number) {
                    this.x = value;
                }
            }

            const bareObj = new X();

            // when
            spy(bareObj);

            // then
            bareObj.method(2);
            expect(bareObj.x).toBe(2);
        });

        it("delegates a call to the mock", () => {
            // given
            const spiedObject = spy(bareObject);

            // when
            when(spiedObject.someMethod()).thenReturn(2);

            // then
            expect(bareObject.someMethod()).toBe(2);
        });

        it("delegates a call to the mock for dynamically created function", () => {
            // given
            bareObject.newMethod = () => true;
            const spiedObject = spy(bareObject);

            // when
            when(spiedObject.newMethod()).thenReturn(false);

            // then
            expect(bareObject.newMethod()).toBeFalsy();
        });
    });

    describe("spy on a prototype", () => {
        it("should be able to spy on a prototype", () => {
            class Foo {
                public method() {
                    return this;
                }
            }

            const spiedPrototype = spy(Foo.prototype);
            const obj = new Foo();

            expect(obj.method()).toBe(obj);
            verify(spiedPrototype.method()).once();
        });
    });
});
