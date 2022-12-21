import { capture, fnmock, cmock, imock, instance, reset, resetCalls, verify, when } from "../src/ts-mockito";

class TestClass {}

if (typeof Proxy !== "undefined") {
    describe("mocking", () => {
        describe("mocking functions", () => {
            it("should mock free functions", () => {
                const fn: () => number = fnmock();

                when(fn()).thenReturn(1);

                expect(instance(fn)()).toEqual(1);
                verify(fn()).called();
            });

            it("should mock functions with multiple call signatures", () => {
                function FN(a: number): number;
                function FN(a: string): string;
                function FN(a: any) { return a; }

                const fn: typeof FN = fnmock();

                when(fn("a")).thenReturn("b");
                when(fn(1)).thenReturn(2);

                expect(instance(fn)("a")).toEqual("b");
                expect(instance(fn)("b")).toBeNull();
                verify(fn("a")).called();

                expect(instance(fn)(1)).toEqual(2);
                expect(instance(fn)(2)).toBeNull();
                verify(fn(1)).called();
            });

            it("should match arguments of free functions", () => {
                const fn: (a: string, b: number) => number = fnmock();

                when(fn("a", 1)).thenReturn(1);

                expect(instance(fn)("a", 1)).toEqual(1);
                expect(instance(fn)("a", 2)).toBeNull();
                verify(fn("a", 1)).called();
            });

            it("should reset mocks", () => {
                const fn: () => number = fnmock();

                when(fn()).thenReturn(1);
                expect(instance(fn)()).toEqual(1);

                reset(fn);
                expect(instance(fn)()).toBeNull();
            });

            it("should reset calls", () => {
                const fn: () => number = fnmock();

                instance(fn)();
                verify(fn()).once();

                resetCalls(fn);
                verify(fn()).never();
            });

            it("should capture parameters", () => {
                const fn: (a: string) => void = fnmock();

                instance(fn)("a");
                expect(capture(fn).last()).toEqual(["a"]);
            });

            it("should mock constructors", () => {
                const ctor: new () => TestClass = cmock();
                const mockClass: TestClass = imock();
                when(new ctor()).thenReturn(instance(mockClass));

                const result = new (instance(ctor))();

                verify(new ctor()).called();
                expect(result).toBe(instance(mockClass));
            });

            it("should mock with empty return values", () => {
                const fn: () => number = fnmock();

                when(fn()).thenReturn(1).thenReturn();

                expect(instance(fn)()).toEqual(1);
                expect(instance(fn)()).toEqual(undefined);
                verify(fn()).called();
            });

            it("should mock with empty throw values", () => {
                const fn: () => number = fnmock();

                when(fn()).thenReturn(1).thenThrow();

                expect(instance(fn)()).toEqual(1);
                expect(() => instance(fn)()).toThrow(undefined)
                verify(fn()).called();
            });
        });
    });
}
