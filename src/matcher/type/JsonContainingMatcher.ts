import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class JsonContainingMatcher extends Matcher {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: string): boolean {
        return _.isMatchWith(JSON.parse(value), this.expectedValue, (objValue, srcValue) => {
          if (srcValue instanceof Matcher) {
            return srcValue.match(objValue);
          } else {
            return undefined;
          }
        });
    }

    public toString(): string {
        return `jsonContaining(${JSON.stringify(this.expectedValue)})`;
    }
}
