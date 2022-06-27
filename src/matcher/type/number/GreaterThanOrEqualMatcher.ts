import {NumberMatcher} from "./NumberMatcher";

export class GreaterThanOrEqualMatcher extends NumberMatcher {
    public match(value: number): boolean {
        return value >= this.value;
    }

    public toString(): string {
        return `greaterThanOrEqual(${this.value})`;
    }
}
