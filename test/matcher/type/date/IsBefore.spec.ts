import {expectType} from "ts-expect";
import {InvalidDateError, MaybeDate} from "../../../../src/matcher/type/date/DateMatcher";
import {IsBeforeMatcher} from "../../../../src/matcher/type/date/IsBeforeMatcher";
import {imock, instance, isBefore, when} from "../../../../src/ts-mockito";

describe("IsBeforeMatcher", () => {
    describe("isBefore()", () => {
        it("should be a IfAfterOrEqualMatcher instance", () => {
            expect(isBefore(new Date()) instanceof IsBeforeMatcher).toBe(true);
        });

        it("should be a date type", () => {
            expectType<Date>(isBefore(new Date()));
        });
    });

    describe("#constructor()", () => {
        it("should accept a number", () => {
            expect(() => new IsBeforeMatcher(0)).not.toThrow();
        });

        it("should accept a string", () => {
            expect(() => new IsBeforeMatcher("2020-01-01")).not.toThrow();
        });

        it("should accept a date", () => {
            expect(() => new IsBeforeMatcher(new Date())).not.toThrow();
        });

        it("should throw an error when given value is not a valid date", () => {
            const date = "asdfg";
            expect(() => new IsBeforeMatcher(date)).toThrow(new InvalidDateError(date));
        });
    });

    describe("#match()", () => {
        it("should return true when the given date is before the expected date", () => {
            const date = "2020-01-02";

            const matcher = new IsBeforeMatcher(date);

            const testDate = "2020-01-01";
            expect(matcher.match(new Date(testDate))).toBe(true);
            expect(matcher.match(testDate)).toBe(true);
            expect(matcher.match(new Date(testDate).getTime())).toBe(true);
        });

        it("should return false when the given date is equal to the expected date", () => {
            const date = "2020-01-01";

            const matcher = new IsBeforeMatcher(date);

            const testDate = "2020-01-01";
            expect(matcher.match(new Date(testDate))).toBe(false);
            expect(matcher.match(testDate)).toBe(false);
            expect(matcher.match(new Date(testDate).getTime())).toBe(false);
        });

        it("should return false when the given date is after the expected date", () => {
            const date = "2020-01-01";

            const matcher = new IsBeforeMatcher(date);

            const testDate = "2020-01-02";
            expect(matcher.match(new Date(testDate))).toBe(false);
            expect(matcher.match(testDate)).toBe(false);
            expect(matcher.match(new Date(testDate).getTime())).toBe(false);
        });

        it("should return false when the given date is an invalid date", () => {
            const matcher = new IsBeforeMatcher(new Date());

            expect(matcher.match(new Date("Invalid Date"))).toBe(false);
        });
    });

    describe("#toString()", () => {
        it("should correctly get the string representation", () => {
            const date = new Date();

            expect(new IsBeforeMatcher(date).toString()).toBe(`isBefore(${date.toISOString()})`);
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

            when(testServiceMock.testMethod(isBefore(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-01"));

            expect(result).toBe(true);
        });

        it("should not pass the verification when the given date is equal to the expected date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBefore(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-01"));

            expect(result).toBeNull();
        });

        it("should not pass the verification when the given date is after the expected date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBefore(date))).thenReturn(true);

            const result = testService.testMethod(new Date("2020-01-02"));

            expect(result).toBeNull();
        });

        it("should not pass the verification when the given date is an invalid date", () => {
            const date = new Date("2020-01-01");

            when(testServiceMock.testMethod(isBefore(date))).thenReturn(true);

            const result = testService.testMethod(new Date("Invalid Date"));

            expect(result).toBeNull();
        });
    });
});

interface TestService {
    testMethod(date: MaybeDate): boolean;
}
