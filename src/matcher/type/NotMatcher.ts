import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class NotMatcher extends Matcher {
    constructor(
        private _delegate: Matcher,
    ) {
        super();
    }

    public match(value: any): boolean {
        return !this._delegate.match(value);
    }

    public toString(): string {
        return `not(${this._delegate.toString()})`;
    }
}
