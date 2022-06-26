import {DateMatcher, isValidDate, MaybeDate} from "./DateMatcher";

export class IsAfterOrEqualMatcher extends DateMatcher {
    public match(value: MaybeDate): boolean {
        value = new Date(value);

        return isValidDate(value) && value.getTime() >= this.date.getTime();
    }

    public toString(): string {
        return `isAfterOrEqual(${this.date.toISOString()})`;
    }
}
