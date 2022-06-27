import {NumberMatcher} from "./NumberMatcher";

export class LowerThanOrEqualMatcher extends NumberMatcher {
    public match(value: number): boolean {
        return value <= this.value;
    }

    public toString(): string {
        return `lowerThanOrEqual(${this.value})`;
    }
}
