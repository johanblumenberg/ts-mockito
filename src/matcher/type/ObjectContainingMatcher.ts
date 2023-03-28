import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class ObjectContainingMatcher extends Matcher {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: Object): boolean {
        return _.isMatchWith(value, this.expectedValue, (objValue, srcValue) => {
          if (srcValue instanceof Matcher) {
            return srcValue.match(objValue);
          } else {
            return undefined;
          }
        });
    }

    public toString(): string {
        return `objectContaining(${JSON.stringify(this.expectedValue)})`;
    }
}
