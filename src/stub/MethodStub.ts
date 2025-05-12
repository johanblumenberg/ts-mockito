export interface MethodStub {
    isOneshot(): boolean;
    isApplicable(args: any[]): boolean;
    execute(args: any[], thisArg: any): void;
    getValue(): any;
    getGroupIndex(): number;
}
