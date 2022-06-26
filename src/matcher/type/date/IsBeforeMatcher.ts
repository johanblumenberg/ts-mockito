import {DateMatcher, isValidDate, MaybeDate} from "./DateMatcher";

export class IsBeforeMatcher extends DateMatcher {
    public match(value: MaybeDate): boolean {
        value = new Date(value);

        return isValidDate(value) && value.getTime() < this.date.getTime();
    }

    public toString(): string {
        return `isBefore(${this.date.toISOString()})`;
    }
}
