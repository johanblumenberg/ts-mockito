import {NumberMatcher} from "./NumberMatcher";

export class LowerThanMatcher extends NumberMatcher {
    public match(value: number): boolean {
        return value < this.value;
    }

    public toString(): string {
        return `lowerThan(${this.value})`;
    }
}
