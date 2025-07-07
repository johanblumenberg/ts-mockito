import {Matcher} from "./Matcher";

export class StrictEqualMatcher extends Matcher {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: any): boolean {
        return this.expectedValue === value;
    }

    public toString(): string {
        if (Array.isArray(this.expectedValue)) {
            return `strictEqual([${this.expectedValue}])`;
        } else {
            return `strictEqual(${this.expectedValue})`;
        }
    }
}
