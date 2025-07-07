import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class DeepEqualMatcher extends Matcher {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: any): boolean {
        return _.isEqualWith(this.expectedValue, value,
            (expected: any, actual: any): boolean => {
                if (Matcher.is(expected)) {
                    return expected.match(actual);
                }

                return undefined;
            });
    }

    public toString(): string {
        return `deepEqual(${JSON.stringify(this.expectedValue)})`;
    }
}
