import {expectType} from "ts-expect";
import {InvalidDateError, MaybeDate} from "../../../../src/matcher/type/date/DateMatcher";
import {IsBeforeOrEqualMatcher} from "../../../../src/matcher/type/date/IsBeforeOrEqualMatcher";
import {imock, instance, isBeforeOrEqual, when} from "../../../../src/ts-mockito";

describe("IsBeforeOrEqualMatcher", () => {
    describe("isBeforeOrEqual()", () => {
        it("should be a IsBeforeOrEqualMatcher instance", () => {
            expect(isBeforeOrEqual(new Date()) instanceof IsBeforeOrEqualMatcher).toBe(true);
        });

        it("should be a date type", () => {
            expectType<Date>(isBeforeOrEqual(new Date()));
        });
    });

    describe("#constructor()", () => {
        it("should accept a number", () => {
            expect(() => new IsBeforeOrEqualMatcher(0)).not.toThrow();
        });

        it("should accept a string", () => {
            expect(() => new IsBeforeOrEqualMatcher("2020-01-01")).not.toThrow();
        });

        it("should accept a date", () => {
            expect(() => new IsBeforeOrEqualMatcher(new Date())).not.toThrow();
        });

        it("should throw an error when given value is not a valid date", () => {
            const date = "asdfg";
            expect(() => new IsBeforeOrEqualMatcher(date)).toThrow(new InvalidDateError(date));
        });
    });

    describe("#match()", () => {
        it("should return true when the given date is before the expected date", () => {
            const date = "2020-01-02";

            const matcher = new IsBeforeOrEqualMatcher(date);

            const testDate = "2020-01-01";
            expect(matcher.match(new Date(testDate))).toBe(true);
            expect(matcher.match(testDate)).toBe(true);
            expect(matcher.match(new Date(testDate).getTime())).toBe(true);
        });

        it("should return true when the given date is equal to the expected date", () => {
            const date = "2020-01-01";

            const matcher = new IsBeforeOrEqualMatcher(date);

            const testDate = "2020-01-01";
            expect(matcher.match(new Date(testDate))).toBe(true);
            expect(matcher.match(testDate)).toBe(true);
            expect(matcher.match(new Date(testDate).getTime())).toBe(true);
        });

        it("should return false when the given date is after the expected date", () => {
            const date = "2020-01-01";

            const matcher = new IsBeforeOrEqualMatcher(date);

            const testDate = "2020-01-02";
            expect(matcher.match(new Date(testDate))).toBe(false);
            expect(matcher.match(testDate)).toBe(false);
            expect(matcher.match(new Date(testDate).getTime())).toBe(false);
        });

        it("should return false when the given date is an invalid date", () => {
            const matcher = new IsBeforeOrEqualMatcher(new Date());

            expect(matcher.match(new Date("Invalid Date"))).toBe(false);
        });
    });

    describe("#toString()", () => {
        it("should correctly get the string representation", () => {
            const date = new Date();

            expect(new IsBeforeOrEqualMatcher(date).toString()).toBe(`isBeforeOrEqual(${date.toISOString()})`);
        });
    });

    describe("stubbing a method", () => {
        let testServiceMock: TestService;
        let testService: TestService;

        beforeEach(() => {
            testServiceMock = imock();
            testService = instance(testServiceMock);
        });

        it("should pass the verification when the given date is before the expected date", () => {
            const date = new Date("2020-01-02");

            when(testServiceMock.testMethod(isBeforeOrEqual(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-01"));

            expect(result).toBe(true);
        });

        it("should pass the verification when the given date is equal to the expected date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBeforeOrEqual(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-01"));

            expect(result).toBe(true);
        });

        it("should not pass the verification when the given date is after the expected date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBeforeOrEqual(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-02"));

            expect(result).toBeNull();
        });

        it("should not pass the verification when the given date is an invalid date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBeforeOrEqual(date))).thenReturn(true);

            const result = testService.testMethod(new Date("Invalid Date"));

            expect(result).toBeNull();
        });
    });
});

interface TestService {
    testMethod(date: MaybeDate): boolean;
}
