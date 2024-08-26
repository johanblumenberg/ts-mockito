import {Matcher} from "../../../src/ts-mockito";

class IsPalindromeMatcher extends Matcher {
    constructor() {
        super();
    }

    public match(value: string): boolean {
        return value === value.split("").reverse().join("");
    }

    public toString(): string {
        return 'isPalindrome()';
    }
}

function isPalindrome(): string {
  return new IsPalindromeMatcher() as any;
}

describe("Custom matcher", () => {
    it("match returns true", () => {
        // given
        const testObj: Matcher = isPalindrome() as any;

        // when
        const result = testObj.match("racecar");

        // then
        expect(result).toBeTruthy();
    });

    it("no match returns false", () => {
      // given
      const testObj: Matcher = isPalindrome() as any;

      // when
      const result = testObj.match("taxi");

      // then
      expect(result).toBeFalsy();
  });
});
