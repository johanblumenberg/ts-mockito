import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class ArrayContainingMatcher extends Matcher {
    constructor(private expectedValue: any) {
        super();
    }

    public match(array: any[]): boolean {
        return array.some(value => {
            if (Matcher.is(this.expectedValue)) {
                return this.expectedValue.match(value);
            } else {
                return this.expectedValue === value;
            }
        });
    }

    public toString(): string {
        return `objectContaining(${JSON.stringify(this.expectedValue)})`;
    }
}
