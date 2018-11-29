import { MethodToStub } from "./MethodToStub";
export declare class MethodStubSetter<T, ResolveType = void, RejectType = void> {
    private methodToStub;
    private static globalGroupIndex;
    private groupIndex;
    constructor(methodToStub: MethodToStub);
    thenReturn(...rest: T[]): this;
    thenThrow(...rest: Error[]): this;
    thenCall(func: (...args: any[]) => any): this;
    thenResolve(...rest: ResolveType[]): this;
    thenReject(...rest: RejectType[]): this;
}
