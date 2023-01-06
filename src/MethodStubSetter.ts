import {MethodToStub} from "./MethodToStub";
import {CallFunctionMethodStub} from "./stub/CallFunctionMethodStub";
import {RejectPromiseMethodStub} from "./stub/RejectPromiseMethodStub";
import {ResolvePromiseMethodStub} from "./stub/ResolvePromiseMethodStub";
import {ReturnValueMethodStub} from "./stub/ReturnValueMethodStub";
import {ThrowErrorMethodStub} from "./stub/ThrowErrorMethodStub";

export interface SyncMethodStubSetter<T> {
    thenReturn(head: T, ...tail: T[]): this;
    thenThrow(head: Error, ...tail: Error[]): this;
    thenCall(func: (...args: any[]) => T): this;
}

export interface VoidSyncMethodStubSetter<T> {
  thenReturn(head: T, ...tail: T[]): this;
  thenReturn(): this;
  thenThrow(head: Error, ...tail: Error[]): this;
  thenCall(func: (...args: any[]) => T): this;
}

export interface AsyncMethodStubSetter<T, ResolveType> extends SyncMethodStubSetter<T> {
    thenResolve(head: ResolveType, ...tail: ResolveType[]): this;
    thenReject(head: any, ...tail: any[]): this;
}

export interface VoidAsyncMethodStubSetter<T, ResolveType> extends VoidSyncMethodStubSetter<T> {
  thenResolve(head: ResolveType, ...tail: ResolveType[]): this;
  thenResolve(): this;
  thenReject(head: any, ...tail: any[]): this;
}

export class MethodStubSetter<T, ResolveType> implements AsyncMethodStubSetter<T, ResolveType>, VoidAsyncMethodStubSetter<T, ResolveType> {
    private static globalGroupIndex: number = 0;
    private groupIndex: number;

    constructor(private methodToStub: MethodToStub) {
        methodToStub.watcher.invoked();
        this.groupIndex = ++MethodStubSetter.globalGroupIndex;
    }

    public thenReturn(...rest: T[]): this {
        // Returns undefined if no return values are given.
        if (rest.length === 0) {
          rest.push(undefined);
        }
        rest.forEach(value => {
            this.methodToStub.methodStubCollection.add(new ReturnValueMethodStub(this.groupIndex, this.methodToStub.matchers, value));
        });
        return this;
    }

    public thenThrow(...rest: Error[]): this {
        rest.forEach(error => {
            this.methodToStub.methodStubCollection.add(new ThrowErrorMethodStub(this.groupIndex, this.methodToStub.matchers, error));
        });
        return this;
    }

    public thenCall(func: (...args: any[]) => T): this {
        this.methodToStub.methodStubCollection.add(new CallFunctionMethodStub(this.groupIndex, this.methodToStub.matchers, func));
        return this;
    }

    public thenResolve(...rest: ResolveType[]): this {
        // Resolves undefined if no resolve values are given.
        if (rest.length === 0) {
            rest.push(undefined);
        }
        rest.forEach(value => {
            this.methodToStub.methodStubCollection.add(new ResolvePromiseMethodStub(this.groupIndex, this.methodToStub.matchers, value));
        });
        return this;
    }

    public thenReject(...rest: any[]): this {
        rest.forEach(value => {
            this.methodToStub.methodStubCollection.add(new RejectPromiseMethodStub(this.groupIndex, this.methodToStub.matchers, value));
        });
        return this;
    }
}
