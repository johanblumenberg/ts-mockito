import {NumberMatcher} from "./NumberMatcher";

export class GreaterThanMatcher extends NumberMatcher {
    public match(value: number): boolean {
        return value > this.value;
    }

    public toString(): string {
        return `greaterThan(${this.value})`;
    }
}
