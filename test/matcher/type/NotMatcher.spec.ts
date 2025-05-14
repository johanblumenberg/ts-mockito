import {Matcher} from "../../../src/matcher/type/Matcher";
import {not, deepEqual} from "../../../src/ts-mockito";

describe("NotMatcher", () => {
    describe("checking if delegate matches matches", () => {
        it("returns false", () => {
            // given
            const testObj: Matcher = not(deepEqual("abc")) as any;

            // when
            const result = testObj.match("abc");

            // then
            expect(result).toBeFalsy();
        });
    });

    describe("checking if delegate does not match", () => {
        it("returns true", () => {
            // given
            const testObj: Matcher = not(deepEqual("abc")) as any;

            // when
            const result = testObj.match("not-matching");

            // then
            expect(result).toBeTruthy();
        });
    });

    describe('description', () => {
        it("description", () => {
            // given
            const testObj: Matcher = not(deepEqual("abc")) as any;

            // then
            expect(testObj.toString()).toEqual("not(deepEqual(\"abc\"))");
        });
    });
});
