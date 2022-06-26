import {DateMatcher, isValidDate, MaybeDate} from "./DateMatcher";

export class IsAfterMatcher extends DateMatcher {
    public match(value: MaybeDate): boolean {
        value = new Date(value);

        return isValidDate(value) && value.getTime() > this.date.getTime();
    }

    public toString(): string {
        return `isAfter(${this.date.toISOString()})`;
    }
}
