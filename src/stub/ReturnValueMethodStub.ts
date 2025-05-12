import {ArgsToMatchersValidator} from "../matcher/ArgsToMatchersValidator";
import {Matcher} from "../matcher/type/Matcher";
import {AbstractMethodStub} from "./AbstractMethodStub";
import {MethodStub} from "./MethodStub";

export class ReturnValueMethodStub extends AbstractMethodStub implements MethodStub {
    private validator: ArgsToMatchersValidator = new ArgsToMatchersValidator();

    constructor(groupIndex: number, private matchers: Array<Matcher>, private returns: any, oneshot: boolean = false) {
        super(groupIndex, oneshot);
    }

    public isApplicable(args: any[]): boolean {
        return this.validator.validate(this.matchers, args);
    }

    public execute(args: any[]): void {

    }

    public getValue(): any {
        return this.returns;
    }
}
