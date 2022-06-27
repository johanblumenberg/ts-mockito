import {Matcher} from "../Matcher";

export abstract class NumberMatcher extends Matcher {
    constructor(protected readonly value: number) {
        super();
    }
}
