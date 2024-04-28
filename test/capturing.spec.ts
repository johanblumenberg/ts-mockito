import {_, capture, instance, mock} from "../src/ts-mockito";
import {Foo} from "./utils/Foo";

describe("capturing method arguments", () => {
    let mockedFoo: Foo;
    let foo: Foo;

    beforeEach(() => {
        mockedFoo = mock(Foo);
        foo = instance(mockedFoo);
    });

    describe("when method has been called", () => {
        it("captures all arguments passed to it", () => {
            // given

            // when
            foo.concatStringWithNumber("first", 1);
            foo.concatStringWithNumber("second", 2);
            foo.concatStringWithNumber("third", 3);

            // then
            const [firstCapturedValue, secondCapturedValue] = capture(mockedFoo.concatStringWithNumber).first();
            expect(firstCapturedValue).toEqual("first");
            expect(secondCapturedValue).toEqual(1);
            expect(capture(mockedFoo.concatStringWithNumber).first()).toEqual(["first", 1]);
            expect(capture(mockedFoo.concatStringWithNumber).second()).toEqual(["second", 2]);
            expect(capture(mockedFoo.concatStringWithNumber).third()).toEqual(["third", 3]);
            expect(capture(mockedFoo.concatStringWithNumber).beforeLast()).toEqual(["second", 2]);
            expect(capture(mockedFoo.concatStringWithNumber).last()).toEqual(["third", 3]);
            expect(capture(mockedFoo.concatStringWithNumber).byCallIndex(0)).toEqual(["first", 1]);
            expect(capture(mockedFoo.concatStringWithNumber).byCallIndex(1)).toEqual(["second", 2]);
            expect(capture(mockedFoo.concatStringWithNumber).byCallIndex(2)).toEqual(["third", 3]);
        });
    });

    describe("when method has been called twice", () => {
        describe("but we want check third call arguments", () => {
            it("throws error", () => {
                // given
                foo.concatStringWithNumber("first", 1);
                foo.concatStringWithNumber("second", 2);

                // when
                let error;
                try {
                    capture(mockedFoo.concatStringWithNumber).third();
                } catch (e) {
                    error = e;
                }

                // then
                expect(error.message).toContain("Cannot capture arguments");
            });
        });
    });

    it('should capture with explicit type arguments with one arg', () => {
      foo.convertNumberToString(1);

      const result = capture<number>(mockedFoo.convertNumberToString).last();
      expect(result[0]).toBe(1);
    });

    it('should capture with explicit type arguments with two args', () => {
      foo.concatStringWithNumber("first", 1);

      const result = capture<string, number>(mockedFoo.concatStringWithNumber).last();
      expect(result[0]).toBe("first");
      expect(result[1]).toBe(1);
    });

    it("should return all invocations", () => {
      foo.concatStringWithNumber("first", 1);
      foo.concatStringWithNumber("second", 2);
      foo.concatStringWithNumber("third", 3);

      const result = capture(mockedFoo.concatStringWithNumber).all();
      expect(result.length).toBe(3);
      expect(result[0][0]).toBe("first");
      expect(result[0][1]).toBe(1);
      expect(result[1][0]).toBe("second");
      expect(result[1][1]).toBe(2);
      expect(result[2][0]).toBe("third");
      expect(result[2][1]).toBe(3);
    });
  });

describe("capture by matching", () => {
    let mockedFoo: Foo;
    let foo: Foo;

    beforeEach(() => {
        mockedFoo = mock(Foo);
        foo = instance(mockedFoo);
    });

    it('should capture arguments', () => {
        foo.concatStringWithNumber("first", 1);

        const result = capture(mockedFoo.concatStringWithNumber, [_, _]).last();
        expect(result[0]).toBe("first");
        expect(result[1]).toBe(1);
    });

    it('should capture arguments with non-matching calls', () => {
        foo.concatStringWithNumber("first", 1);
        foo.concatStringWithNumber("second", 2);
        foo.concatStringWithNumber("third", 3);

        const result = capture(mockedFoo.concatStringWithNumber, ["second", _]).last();
        expect(result[0]).toBe("second");
        expect(result[1]).toBe(2);
    });

    it("should return all matching invocations", () => {
        foo.concatStringWithNumber("first", 1);
        foo.concatStringWithNumber("second", 1);
        foo.concatStringWithNumber("second", 2);
        foo.concatStringWithNumber("second", 3);
        foo.concatStringWithNumber("third", 3);

        const result = capture(mockedFoo.concatStringWithNumber, ["second", _]).all();
        expect(result.length).toBe(3);
        expect(result[0][0]).toBe("second");
        expect(result[0][1]).toBe(1);
        expect(result[1][0]).toBe("second");
        expect(result[1][1]).toBe(2);
        expect(result[2][0]).toBe("second");
        expect(result[2][1]).toBe(3);
    });
});
