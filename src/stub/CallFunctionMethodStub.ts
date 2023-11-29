import { MethodToStub } from "../MethodToStub";
import {ArgsToMatchersValidator} from "../matcher/ArgsToMatchersValidator";
import {Matcher} from "../matcher/type/Matcher";
import {AbstractMethodStub} from "./AbstractMethodStub";
import {MethodStub} from "./MethodStub";

export interface MockInvocation<T> {
  proceed(...args: any[]): T;
}

export class CallFunctionMethodStub<T> extends AbstractMethodStub implements MethodStub, MockInvocation<T> {
    private validator: ArgsToMatchersValidator = new ArgsToMatchersValidator();
    private functionResult: any;

    constructor(protected groupIndex: number, private matchers: Array<Matcher>, private methodToStub: MethodToStub, private func: any) {
        super();
    }

    public isApplicable(args: any[]): boolean {
        return this.validator.validate(this.matchers, args);
    }

    public execute(args: any[]): void {
        this.functionResult = this.func(...args);
    }

    public getValue(): any {
        return this.functionResult;
    }

    public proceed(...args: any[]): T {
        return this.methodToStub.mocker.proceed(this.methodToStub.methodName, args);
    }
}
