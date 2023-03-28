import {Matcher} from "../../../src/matcher/type/Matcher";
import {objectContaining, startsWith} from "../../../src/ts-mockito";

describe("ObjectContainingMatcher", () => {
    describe("checking if source object contains given object", () => {
        const testObj: Matcher = objectContaining({b: {c: "c", d: {}}}) as unknown as Matcher;

        describe("when given value contains given object", () => {
            it("returns true", () => {
                // when
                const result = testObj.match({a: "a", b: {c: "c", d: {}}});

                // then
                expect(result).toBeTruthy();
            });

            it("returns true", () => {
                // when
                const result = testObj.match({b: {c: "c", d: {}}});

                // then
                expect(result).toBeTruthy();
            });
        });

        describe("when given value doesn't contain given object", () => {
            it("returns false", () => {
                // when
                const result = testObj.match({b: {c: "c"}});

                // then
                expect(result).toBeFalsy();
            });
        });
    });

    describe("accept matchers as values", () => {
      it("should match using matcher as value", () => {
        const testObj: Matcher = objectContaining({ key: startsWith("abc") }) as unknown as Matcher;
        const result = testObj.match({key: "abcdef"});
        expect(result).toBeTruthy();
      });

      it("should not match using matcher as value with mismatching value", () => {
        const testObj: Matcher = objectContaining({ key: startsWith("abc") }) as unknown as Matcher;
        const result = testObj.match({key: "def"});
        expect(result).toBeFalsy();
      });
    });

    describe("accept matchers as values in arrays", () => {
      it("should match using matcher as value", () => {
        const testObj: Matcher = objectContaining({ key: [startsWith("abc")] }) as unknown as Matcher;
        const result = testObj.match({key: ["abcdef"]});
        expect(result).toBeTruthy();
      });

      it("should not match using matcher as value with mismatching value", () => {
        const testObj: Matcher = objectContaining({ key: [startsWith("abc")] }) as unknown as Matcher;
        const result = testObj.match({key: ["def"]});
        expect(result).toBeFalsy();
      });
    });

    describe("types", () => {
        it("deduce type from return value", () => {
            const result: { a: boolean, b: boolean } = objectContaining({a: true});
            expect(result).toBeTruthy();
        });

        it("still work with any", () => {
            const result: any = objectContaining({ value: { a: true }});
            expect(result).toBeTruthy();
        });

        it("still work with any in nested value", () => {
            const result: { value: any } = objectContaining({ value: { a: true }});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with boolean in values", () => {
            const result: { value: boolean} = objectContaining({ value: true});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with boolean in nested values", () => {
            const result: { value: { a: boolean, b: boolean }} = objectContaining({ value: {a: true}});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with string in values", () => {
            const result: { value: string } = objectContaining({ value: 'value'});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with string in nested values", () => {
            const result: { value: { a: string, b: string }} = objectContaining({ value: {a: 'value'}});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with array in values", () => {
            const result: { value: { x: number }[]} = objectContaining({ value: [{}]});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with array in nested values", () => {
            const result: { value: {  x: { x: number }[]} } = objectContaining({ value: { x: [{}]}});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with optional in values", () => {
            const result: { value?: boolean} = objectContaining({ value: true});
            expect(result).toBeTruthy();
        });

        it("deduce type from return value with optional in nested values", () => {
            const result: { value: { a?: boolean, b: boolean }} = objectContaining({ value: {a: true}});
            expect(result).toBeTruthy();
        });
    });
});
