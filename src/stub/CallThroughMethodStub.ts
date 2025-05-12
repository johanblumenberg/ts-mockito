import {MethodStub} from "./MethodStub";

export class CallThroughMethodStub implements MethodStub {
    private result: any;

    constructor(private instance: any, private method: Function) {
    }

    public isOneshot(): boolean {
        return false;
    }

    public getGroupIndex(): number {
        return -1;
    }

    public isApplicable(args: any[]): boolean {
        return false;
    }

    public execute(args: any[], thisArg: any): void {
        this.result = this.method.apply(thisArg, args);
    }

    public getValue(): any {
        return this.result;
    }
}
