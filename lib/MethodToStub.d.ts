import { Matcher } from "./matcher/type/Matcher";
import { MethodStubCollection } from "./MethodStubCollection";
import { Mocker } from "./Mock";
export declare class MethodToStub {
    methodStubCollection: MethodStubCollection;
    matchers: Matcher[];
    mocker: Mocker;
    methodName: string;
    constructor(methodStubCollection: MethodStubCollection, matchers: Matcher[], mocker: Mocker, methodName: string);
}
