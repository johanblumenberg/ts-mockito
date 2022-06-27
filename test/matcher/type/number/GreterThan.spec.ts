import {expectType} from "ts-expect";
import {GreaterThanMatcher} from "../../../../src/matcher/type/number/GreaterThanMatcher";
import {greaterThan, imock, instance, when} from "../../../../src/ts-mockito";

describe("GreaterThanMatcher", () => {
    describe("greaterThan()", () => {
        it("should be a IfAfterOrEqualMatcher instance", () => {
            expect((greaterThan(0) as any) instanceof GreaterThanMatcher).toBe(true);
        });

        it("should be a number type", () => {
            expectType<number>(greaterThan(0));
        });
    });

    describe("#match()", () => {
        it("should return true when the given number is greater than the expected number", () => {
            const matcher = new GreaterThanMatcher(0);

            expect(matcher.match(1)).toBe(true);
        });

        it("should return false when the given number is equal to the expected number", () => {
            const matcher = new GreaterThanMatcher(0);

            expect(matcher.match(0)).toBe(false);
        });

        it("should return false when the given number is lower than the expected number", () => {
            const matcher = new GreaterThanMatcher(0);

            expect(matcher.match(-1)).toBe(false);
        });
    });

    describe("#toString()", () => {
        it("should correctly get the string representation", () => {
            const expected = 0;

            expect(new GreaterThanMatcher(expected).toString()).toBe(`greaterThan(${expected})`);
        });
    });

    describe("stubbing a method", () => {
        let testServiceMock: TestService;
        let testService: TestService;

        beforeEach(() => {
            testServiceMock = imock();
            testService = instance(testServiceMock);
        });

        it("should pass the verification when the given number is greater than the expected number", () => {
            const expected = 0;

            when(testServiceMock.testMethod(greaterThan(expected))).thenReturn(true);

            const result = testService.testMethod(1);

            expect(result).toBe(true);
        });

        it("should not pass the verification when the given number is equal to the expected number", () => {
            const expected = 0;

            when(testServiceMock.testMethod(greaterThan(expected))).thenReturn(true);

            const result = testService.testMethod(expected);

            expect(result).toBeNull();
        });

        it("should not pass the verification when the given number is lower than the expected number", () => {
            const expected = 0;

            when(testServiceMock.testMethod(greaterThan(expected))).thenReturn(true);

            const result = testService.testMethod(-1);

            expect(result).toBeNull();
        });
    });
});

interface TestService {
    testMethod(date: number): boolean;
}
