import {Matcher} from "../../../src/matcher/type/Matcher";
import {jsonContaining, startsWith} from "../../../src/ts-mockito";

describe("JsonContainingMatcher", () => {
    describe("checking if source object contains given object", () => {
        const testObj: Matcher = jsonContaining({b: {c: "c", d: {}}}) as unknown as Matcher;

        describe("when given value contains given object", () => {
            it("returns true", () => {
                // when
                const result = testObj.match('{"a": "a", "b": {"c": "c", "d": {}}}');

                // then
                expect(result).toBeTruthy();
            });

            it("returns true", () => {
                // when
                const result = testObj.match('{"b": {"c": "c", "d": {}}}');

                // then
                expect(result).toBeTruthy();
            });
        });

        describe("when given value doesn't contain given object", () => {
            it("returns false", () => {
                // when
                const result = testObj.match('{"b": {"c": "c"}}');

                // then
                expect(result).toBeFalsy();
            });
        });
    });

    describe("accept matchers as values", () => {
      it("should match using matcher as value", () => {
        const testObj: Matcher = jsonContaining({ key: startsWith("abc") }) as unknown as Matcher;
        const result = testObj.match('{"key": "abcdef"}');
        expect(result).toBeTruthy();
      });

      it("should not match using matcher as value with mismatching value", () => {
        const testObj: Matcher = jsonContaining({ key: startsWith("abc") }) as unknown as Matcher;
        const result = testObj.match('{"key": "def"}');
        expect(result).toBeFalsy();
      });
    });

    describe("accept matchers as values in arrays", () => {
      it("should match using matcher as value", () => {
        const testObj: Matcher = jsonContaining({ key: [startsWith("abc")] }) as unknown as Matcher;
        const result = testObj.match('{"key": ["abcdef"]}');
        expect(result).toBeTruthy();
      });

      it("should not match using matcher as value with mismatching value", () => {
        const testObj: Matcher = jsonContaining({ key: [startsWith("abc")] }) as unknown as Matcher;
        const result = testObj.match('{"key": ["def"]}');
        expect(result).toBeFalsy();
      });
    });
});
