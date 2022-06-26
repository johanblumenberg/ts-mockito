import {Matcher} from "../Matcher";

export abstract class DateMatcher extends Matcher {
    protected readonly date: Date;

    constructor(date: MaybeDate) {
        super();

        this.date = new Date(date);

        if (!isValidDate(this.date)) {
            throw new InvalidDateError(date);
        }
    }
}

export class InvalidDateError extends Error {
    public readonly name = this.constructor.name;

    constructor(date: MaybeDate) {
        super(`Invalid date: ${date}`);

        Object.setPrototypeOf(this, InvalidDateError.prototype);
    }
}

export type MaybeDate = number | string | Date;

/** @internal */
export function isValidDate(date: Date): date is Date {
    return !Number.isNaN(date.getTime());
}
