import {_, anything, imock, instance, mock, when} from "../src/ts-mockito";
import {Foo} from "./utils/Foo";

describe("mocking", () => {
    let mockedFoo: Foo;
    let foo: Foo;

    beforeEach(() => {
        mockedFoo = mock(Foo);
        foo = instance(mockedFoo);
    });

    describe("calling method", () => {
        describe("with stubbed return value", () => {
            describe("without params", () => {
                it("returns stubbed value", () => {
                    // given
                    const expectedResult = "fake result";
                    when(mockedFoo.getBar()).thenReturn(expectedResult);

                    // when
                    const result = foo.getBar();

                    // then
                    expect(result).toEqual(expectedResult);
                });

                it("returns stubbed value once", () => {
                    // given
                    when(mockedFoo.getBar()).thenReturn("standard result");
                    when(mockedFoo.getBar()).thenReturnOnce("once result");

                    // when
                    const result1 = foo.getBar();
                    // then
                    expect(result1).toEqual("once result");

                    // when
                    const result2 = foo.getBar();
                    // then
                    expect(result2).toEqual("standard result");
                });
            });

            describe("with single param", () => {
                it("returns stubbed value", () => {
                    // given
                    const expectedResult = "sampleResult";
                    const sampleNumber = 10;
                    when(mockedFoo.convertNumberToString(sampleNumber)).thenReturn(expectedResult);

                    // when
                    const result = foo.convertNumberToString(sampleNumber);

                    // then
                    expect(result).toEqual(expectedResult);
                });
            });

            describe("with two params", () => {
                it("returns stubbed value if two params matches", () => {
                    // given
                    const expectedResult = 999;
                    const firstNumber = 20;
                    const secondNumber = 30;
                    when(mockedFoo.sumTwoNumbers(firstNumber, secondNumber)).thenReturn(expectedResult);

                    // when
                    const result = foo.sumTwoNumbers(firstNumber, secondNumber);

                    // then
                    expect(result).toEqual(expectedResult);
                });

                it("returns null if first param doesn't match", () => {
                    // given
                    const expectedResult = 999;
                    const firstNumber = 20;
                    const secondNumber = 30;
                    when(mockedFoo.sumTwoNumbers(firstNumber, secondNumber)).thenReturn(expectedResult);

                    // when
                    const result = foo.sumTwoNumbers(123, secondNumber);

                    // then
                    expect(result).toBeNull();
                });

                it("returns null if second param doesn't match", () => {
                    // given
                    const expectedResult = 999;
                    const firstNumber = 20;
                    const secondNumber = 30;
                    when(mockedFoo.sumTwoNumbers(firstNumber, secondNumber)).thenReturn(expectedResult);

                    // when
                    const result = foo.sumTwoNumbers(firstNumber, 123);

                    // then
                    expect(result).toBeNull();
                });

                it("returns null if both params doesn't match", () => {
                    // given
                    const expectedResult = 999;
                    const firstNumber = 20;
                    const secondNumber = 30;
                    when(mockedFoo.sumTwoNumbers(firstNumber, secondNumber)).thenReturn(expectedResult);

                    // when
                    const result = foo.sumTwoNumbers(123, 321);

                    // then
                    expect(result).toBeNull();
                });
            });

            describe("with optional argument", () => {
                describe("and optional argument is provided", () => {
                    it("returns stubbed value", () => {
                        // given
                        const expectedResult = 999;
                        const firstNumber = 2;
                        const secondNumber = 3;
                        when(mockedFoo.sampleMethodWithOptionalArgument(firstNumber, secondNumber)).thenReturn(expectedResult);

                        // when
                        const result = foo.sampleMethodWithOptionalArgument(firstNumber, secondNumber);

                        // then
                        expect(expectedResult).toEqual(result);
                    });
                });

                describe("and optional argument is not provided", () => {
                    it("returns stubbed value", () => {
                        // given
                        const firstExpectedResult = 999;
                        const secondExpectedResult = 333;
                        const firstNumber = 2;
                        const secondNumber = 3;
                        when(mockedFoo.sampleMethodWithOptionalArgument(firstNumber)).thenReturn(firstExpectedResult);
                        when(mockedFoo.sampleMethodWithOptionalArgument(firstNumber, secondNumber)).thenReturn(secondExpectedResult);

                        // when
                        const firstResult = foo.sampleMethodWithOptionalArgument(firstNumber);
                        const secondResult = foo.sampleMethodWithOptionalArgument(firstNumber, secondNumber);

                        // then
                        expect(firstExpectedResult).toEqual(firstResult);
                        expect(secondExpectedResult).toEqual(secondResult);
                    });
                });
            });
        });

        describe("with stubbed error", () => {
            it("throws given error", () => {
                // given
                const sampleValue = 123;
                const sampleError = new Error("sampleError");
                when(mockedFoo.convertNumberToString(sampleValue)).thenThrow(sampleError);

                // when
                let error = null;
                try {
                    foo.convertNumberToString(sampleValue);
                } catch (e) {
                    error = e;
                }

                // then
                expect(error.message).toEqual("sampleError");
            });

            it("throws given error once", () => {
                // given
                const sampleError = new Error("sampleError");
                when(mockedFoo.getBar()).thenReturn("standard result");
                when(mockedFoo.getBar()).thenThrowOnce(sampleError);

                // when
                let error = null;
                try {
                    foo.getBar();
                } catch (e) {
                    error = e;
                }

                // then
                expect(error.message).toEqual("sampleError");

                // when
                const result = foo.getBar();
                // then
                expect(result).toEqual("standard result");
            });
        });

        describe("with stubbed promise resolve", () => {
            it("resolves with given value", done => {
                // given
                const sampleValue = "abc";
                const expectedResult = "def";
                when(mockedFoo.sampleMethodReturningPromise(sampleValue)).thenResolve(expectedResult);

                // when
                foo.sampleMethodReturningPromise(sampleValue)
                    .then(value => {
                        // then
                        expect(value).toEqual(expectedResult);
                        done();
                    })
                    .catch(err => done.fail(err));
            });

            it("resolves with given value once", async () => {
                // given
                when(mockedFoo.sampleMethodReturningPromise(_)).thenResolve("standard result");
                when(mockedFoo.sampleMethodReturningPromise(_)).thenResolveOnce("once result");

                // when
                const result1 = await foo.sampleMethodReturningPromise("123");
                // then
                expect(result1).toEqual("once result");

                // when
                const result2 = await foo.sampleMethodReturningPromise("123");
                // then
                expect(result2).toEqual("standard result");
            });

            it("resolves with given value for PromiseLike", done => {
                // given
                const sampleValue = "abc";
                const expectedResult = "def";
                when(mockedFoo.sampleMethodReturningPromiseLike(sampleValue)).thenResolve(expectedResult);

                // when
                foo.sampleMethodReturningPromiseLike(sampleValue)
                    .then(value => {
                        // then
                        expect(value).toEqual(expectedResult);
                        done();
                    });
            });

            it("resolves with multiple values", done => {
                when(mockedFoo.sampleMethodReturningPromise("abc")).thenResolve("one", "two", "three");

                foo.sampleMethodReturningPromise("abc")
                    .then(value => {
                        expect(value).toEqual("one");
                        return foo.sampleMethodReturningPromise("abc");
                    })
                    .then(value => {
                        expect(value).toEqual("two");
                        return foo.sampleMethodReturningPromise("abc");
                    })
                    .then(value => {
                        expect(value).toEqual("three");
                        done();
                    })
                    .catch(err => done.fail(err));
            });

            it("resolves void promise", done => {
                when(mockedFoo.sampleMethodReturningVoidPromise("abc")).thenResolve(undefined);

                foo.sampleMethodReturningVoidPromise("abc")
                    .then(() => {
                        done();
                    })
                    .catch(err => done.fail(err));
            });

            it("resolves void promise without arguments", done => {
                when(mockedFoo.sampleMethodReturningVoidPromise("abc")).thenResolve();

                foo.sampleMethodReturningVoidPromise("abc")
                    .then(() => {
                        done();
                    })
                    .catch(err => done.fail(err));
            });

            // Should not compile
            // it("should not allow thenResolve without arguments if the return type is not Promise<void>", done => {
            //     when(mockedFoo.sampleMethodReturningPromise("abc")).thenResolve();
            // });
            
            if (typeof Proxy !== "undefined") {
                it("resolves with given mock value", done => {
                    // given
                    const sampleValue = "abc";
                    const expectedResult: Foo = imock();

                    when(mockedFoo.sampleMethodReturningObjectPromise(sampleValue)).thenResolve(instance(expectedResult));

                    // when
                    foo.sampleMethodReturningObjectPromise(sampleValue)
                        .then(value => {
                            // then
                            expect(value).toEqual(instance(expectedResult));
                            done();
                        })
                        .catch(err => done.fail(err));
                });

                it('compiles when the return type is any', () => {
                    interface Foo {
                        a(): number;
                        b(): Promise<number>;
                        c(): any;
                    }

                    const mockedFoo: Foo = imock();

                    // when(mockedFoo.a()).thenResolve(1); // - should not compile
                    when(mockedFoo.b()).thenResolve(1); // - should compile
                    when(mockedFoo.c()).thenResolve(1); // - should compile
                });
            }
        });

        describe("with stubbed promise rejection", () => {
            it("rejects with given error", done => {
                // given
                const sampleValue = "abc";
                const sampleError = new Error("sampleError");
                when(mockedFoo.sampleMethodReturningPromise(sampleValue)).thenReject(sampleError);

                // when
                foo.sampleMethodReturningPromise(sampleValue)
                    .then(value => done.fail())
                    .catch(err => {
                        // then
                        expect(err.message).toEqual("sampleError");
                        done();
                    });
            });

            it("rejects with given error once", done => {
                // given
                const sampleError = new Error("sampleError");
                when(mockedFoo.sampleMethodReturningPromise(_)).thenResolve("standard result");
                when(mockedFoo.sampleMethodReturningPromise(_)).thenRejectOnce(sampleError);

                // when
                foo.sampleMethodReturningPromise("abc")
                    .then(value => done.fail())
                    .catch(err => {
                        // then
                        expect(err.message).toEqual("sampleError");
                        done();
                    });

                // when
                foo.sampleMethodReturningPromise("abc")
                    .then(value => {
                        // then
                        expect(value).toEqual("standard result");
                        done();
                    })
                    .catch(err => done.fail(err));
            });

            it("rejects with given value for PromiseLike", done => {
                // given
                const sampleValue = "abc";
                const sampleError = new Error("sampleError");
                when(mockedFoo.sampleMethodReturningPromiseLike(sampleValue)).thenReject(sampleError);

                // when
                (foo.sampleMethodReturningPromiseLike(sampleValue) as Promise<string>)
                    .then(value => done.fail("promise was not rejected"))
                    .catch(err => {
                        // then
                        expect(err.message).toEqual("sampleError");
                        done();
                    });
            });

            it("rejects with multiple values", done => {
                const sampleError1 = new Error("one");
                const sampleError2 = new Error("two");
                const sampleError3 = new Error("three");
                when(mockedFoo.sampleMethodReturningPromise("abc")).thenReject(sampleError1, sampleError2, sampleError3);

                foo.sampleMethodReturningPromise("abc")
                    .then(value => done.fail("promise was not rejected"))
                    .catch(err => {
                        expect(err.message).toEqual("one");
                        return foo.sampleMethodReturningPromise("abc");
                    })
                    .then(value => done.fail("promise was not rejected"))
                    .catch(err => {
                        expect(err.message).toEqual("two");
                        return foo.sampleMethodReturningPromise("abc");
                    })
                    .then(value => done.fail("promise was not rejected"))
                    .catch(err => {
                        expect(err.message).toEqual("three");
                        done();
                    })
            });

            it("rejects void promise", done => {
                const sampleError = new Error("sampleError");
                when(mockedFoo.sampleMethodReturningVoidPromise("abc")).thenReject(sampleError);

                foo.sampleMethodReturningVoidPromise("abc")
                    .then(value => done.fail("promise was not rejected"))
                    .catch(err => {
                        expect(err.message).toEqual("sampleError");
                        done();
                    });
            });

            // Should not compile
            // it("should not allow thenReject without arguments if the return type is Promise<void>", done => {
            //     when(mockedFoo.sampleMethodReturningVoidPromise("abc")).thenReject();
            // });

            // Should not compile
            // it("should not allow thenReject without arguments if the return type is not Promise<void>", done => {
            //     when(mockedFoo.sampleMethodReturningPromise("abc")).thenReject();
            /// });
        });

        describe("with stubbed function call", () => {
            it("calls given function", () => {
                // given
                const sampleValue = 123;
                let called = false;
                when(mockedFoo.convertNumberToString(sampleValue)).thenCall(() => {
                    called = true;
                    return "";
                });

                // when
                foo.convertNumberToString(sampleValue);

                // then
                expect(called).toBeTruthy();
            });
        });

        describe("with stubbed function call", () => {
            describe("if mocked method is called with different argument", () => {
                it("dont call given function", () => {
                    // given
                    const sampleValue = 123;
                    let called = false;
                    when(mockedFoo.convertNumberToString(sampleValue)).thenCall(() => {
                        called = true;
                        return "";
                    });

                    // when
                    foo.convertNumberToString(999);

                    // then
                    expect(called).toBeFalsy();
                });
            });
        });

        describe("with stubbed function call", () => {
            it("returns value returned by given function", () => {
                // given
                const sampleValue = 123;
                const expectedResult = "valueFromFunction";
                when(mockedFoo.convertNumberToString(sampleValue)).thenCall(() => {
                    return expectedResult;
                });

                // when
                const result = foo.convertNumberToString(sampleValue);

                // then
                expect(result).toEqual(expectedResult);
            });
        });

        describe("with stubbed function call", () => {
            it("pass arguments to given function", () => {
                // given
                const firstNumber = 5;
                const secondNumber = 10;
                const expectedResult = 50;
                when(mockedFoo.sumTwoNumbers(firstNumber, secondNumber)).thenCall((arg1: number, arg2: number) => {
                    return arg1 * arg2;
                });

                // when
                const result = foo.sumTwoNumbers(firstNumber, secondNumber);

                // then
                expect(result).toEqual(expectedResult);
            });
        });

        describe("that was found in the constructor code", () => {
            it("returns mocked value", () => {
                // given
                const expectedResult = "fakeValue";
                when(mockedFoo.dynamicMethod(anything())).thenReturn(expectedResult);

                // when
                const result = foo.dynamicMethod("sample matching anything() matcher");

                // then
                expect(result).toEqual(expectedResult);
            });
        });

        describe("that was found in the function code", () => {
            it("returns mocked value", () => {
                // given
                const expectedResult = "fakeValue";
                when(mockedFoo.dynamicMethodInFunction(anything())).thenReturn(expectedResult);

                // when
                const result = foo.dynamicMethodInFunction("sample matching anything() matcher");

                // then
                expect(result).toEqual(expectedResult);
            });
        });
    });

    describe("calling method", () => {
        describe("that does not exists", () => {
            it("throws error", () => {
                // given

                // when
                let error = null;
                try {
                    foo["notExistingMethod"]();
                } catch (e) {
                    error = e;
                }

                // then
                expect(error).not.toBeNull();
            });
        });
    });
});
