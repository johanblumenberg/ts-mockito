import { Matcher } from "./matcher/type/Matcher";
import { MethodAction } from "./MethodAction";
import { MethodStub } from "./stub/MethodStub";
import { ObjectInspector } from "./utils/ObjectInspector";
export declare enum MockPropertyPolicy {
    StubAsProperty = 0,
    StubAsMethod = 1,
    Throw = 2,
}
export declare class Mocker {
    private clazz;
    protected instance: any;
    protected objectInspector: ObjectInspector;
    private methodStubCollections;
    private methodActions;
    private mock;
    private mockableFunctionsFinder;
    private objectPropertyCodeRetriever;
    constructor(clazz: any, policy: MockPropertyPolicy, instance?: any);
    getMock(): any;
    createCatchAllHandlerForRemainingPropertiesWithoutGetters(origin: "instance" | "expectation"): any;
    reset(): void;
    resetCalls(): void;
    getAllMatchingActions(methodName: string, matchers: Array<Matcher>): Array<MethodAction>;
    getFirstMatchingAction(methodName: string, matchers: Array<Matcher>): MethodAction;
    getActionsByName(name: string): MethodAction[];
    protected processProperties(object: any): void;
    protected createInstancePropertyDescriptorListener(key: string, descriptor: PropertyDescriptor, prototype: any): void;
    protected createInstanceActionListener(key: string, prototype: any): void;
    protected createActionListener(key: string): () => any;
    protected getEmptyMethodStub(key: string, args: any[]): MethodStub;
    private processClassCode(clazz);
    private processFunctionsCode(object);
    private createMixedStub(key);
    private createPropertyStub(key);
    private createMethodStub(key);
    private createMethodToStub(key);
    private getMethodStub(key, args);
}
