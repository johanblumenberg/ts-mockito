import {Matcher} from "../../../src/matcher/type/Matcher";
import {arrayContaining, startsWith} from "../../../src/ts-mockito";

describe("ArrayContainingMatcher", () => {
    describe("checking if source object contains given object", () => {
        const testObj: Matcher = arrayContaining("value") as unknown as Matcher;

        describe("when given value contains given object", () => {
            it("returns true for single value", () => {
                // when
                const result = testObj.match(["value"]);

                // then
                expect(result).toBeTruthy();
            });

            it("returns true for first value", () => {
                // when
                const result = testObj.match(["value", "other"]);

                // then
                expect(result).toBeTruthy();
            });

            it("returns true for last value", () => {
                // when
                const result = testObj.match(["other", "value"]);

                // then
                expect(result).toBeTruthy();
            });
        });

        describe("when given value doesn't contain given object", () => {
            it("returns false", () => {
                // when
                const result = testObj.match(["other"]);

                // then
                expect(result).toBeFalsy();
            });
        });
    });

    describe("accept matchers as values", () => {
      it("should match using matcher as value", () => {
        const testObj: Matcher = arrayContaining(startsWith("abc")) as unknown as Matcher;
        const result = testObj.match(["abcdef"]);
        expect(result).toBeTruthy();
      });

      it("should not match using matcher as value with mismatching value", () => {
        const testObj: Matcher = arrayContaining(startsWith("abc")) as unknown as Matcher;
        const result = testObj.match(["def"]);
        expect(result).toBeFalsy();
      });
    });
});
