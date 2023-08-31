import {
    ArgCaptor,
    ArgCaptor1,
    ArgCaptor10,
    ArgCaptor2,
    ArgCaptor3,
    ArgCaptor4,
    ArgCaptor5,
    ArgCaptor6,
    ArgCaptor7,
    ArgCaptor8,
    ArgCaptor9,
} from "./capture/ArgCaptor";
import {AnyFunctionMatcher} from "./matcher/type/AnyFunctionMatcher";
import {AnyNumberMatcher} from "./matcher/type/AnyNumberMatcher";
import {AnyOfClassMatcher} from "./matcher/type/AnyOfClassMatcher";
import {AnyStringMatcher} from "./matcher/type/AnyStringMatcher";
import {AnythingMatcher} from "./matcher/type/AnythingMatcher";
import {BetweenMatcher} from "./matcher/type/BetweenMatcher";
import {MaybeDate} from "./matcher/type/date/DateMatcher";
import {IsAfterMatcher} from "./matcher/type/date/IsAfterMatcher";
import {IsAfterOrEqualMatcher} from "./matcher/type/date/IsAfterOrEqualMatcher";
import {IsBeforeMatcher} from "./matcher/type/date/IsBeforeMatcher";
import {IsBeforeOrEqualMatcher} from "./matcher/type/date/IsBeforeOrEqualMatcher";
import {DeepEqualMatcher} from "./matcher/type/DeepEqualMatcher";
import {EndsWithMatcher} from "./matcher/type/EndsWithMatcher";
import {MatchingStringMatcher} from "./matcher/type/MatchingStringMatcher";
import {NotNullMatcher} from "./matcher/type/NotNullMatcher";
import {GreaterThanMatcher} from "./matcher/type/number/GreaterThanMatcher";
import {GreaterThanOrEqualMatcher} from "./matcher/type/number/GreaterThanOrEqualMatcher";
import {LowerThanMatcher} from "./matcher/type/number/LowerThanMatcher";
import {LowerThanOrEqualMatcher} from "./matcher/type/number/LowerThanOrEqualMatcher";
import {ObjectContainingMatcher} from "./matcher/type/ObjectContainingMatcher";
import {StartsWithMatcher} from "./matcher/type/StartsWithMatcher";
import {StrictEqualMatcher} from "./matcher/type/StrictEqualMatcher";
import {AsyncMethodStubSetter,VoidAsyncMethodStubSetter,MethodStubSetter,SyncMethodStubSetter,VoidSyncMethodStubSetter} from "./MethodStubSetter";
import {MethodStubVerificator} from "./MethodStubVerificator";
import {MethodToStub} from "./MethodToStub";
import {Mocker, MockPropertyPolicy} from "./Mock";
import {Spy} from "./Spy";

// Keep a reference to the original, in case it is replaced with fake timers
// by some library like jest or lolex
const originalSetTimeout = setTimeout;
const originalSetImmediate = 'setImmediate' in globalThis ? setImmediate : setTimeout;

export {MockPropertyPolicy} from "./Mock";

export function spy<T>(instanceToSpy: T): T {
    return new Spy(instanceToSpy).getMock();
}

export function mock<T>(clazz: (new(...args: any[]) => T) | (Function & { prototype: T }), policy: MockPropertyPolicy = MockPropertyPolicy.StubAsProperty): T {
    return new Mocker(clazz, policy).getMock();
}

export function imock<T>(policy: MockPropertyPolicy = MockPropertyPolicy.StubAsMethod): NonNullable<T> extends object ? T : unknown {
    class Empty {}
    const mockedValue = new Mocker(Empty, policy).getMock();

    if (typeof Proxy === "undefined") {
        throw new Error("Mocking of interfaces requires support for Proxy objects");
    }
    const tsmockitoMocker = mockedValue.__tsmockitoMocker as Mocker;
    return new Proxy(mockedValue, tsmockitoMocker.createCatchAllHandlerForRemainingPropertiesWithoutGetters("expectation"));
}

export function fnmock<T extends (...args: any[]) => void>(): T {
    class Mock {
        public fn(...args: any[]): any { return null; }
    }

    const m: Mock = mock(Mock);
    (m.fn as any).__tsmockitoInstance = instance(m).fn;
    (m.fn as any).__tsmockitoMocker = (m as any).__tsmockitoMocker;
    return m.fn as T;
}

export function cmock<R, T extends any[]>(): new (...args: T) => R {
    return fnmock() as any;
}

/**
 * Avoid warnings from jasmine of the form:
 *   WARN: 'Spec '<spec>' has no expectations.'
 * This warning is logged when a test doesn't have
 * any expectations using jasmine `expect(...)`.
 */
let expectNothing = () => {
    expectNothing = 'expect' in globalThis && 'nothing' in expect()
        ? () => { expect().nothing(); }
        : () => {};
    expectNothing();
};

export function verify<T>(method: T): MethodStubVerificator<T> {
    expectNothing();
    return new MethodStubVerificator(method as any);
}

export function when<T>(method: PromiseLike<void>): VoidAsyncMethodStubSetter<PromiseLike<T>, T>;
export function when<T>(method: PromiseLike<T>): AsyncMethodStubSetter<PromiseLike<T>, T>;
export function when<T>(method: Promise<T>): AsyncMethodStubSetter<Promise<T>, T>;
export function when<T>(method: void): VoidSyncMethodStubSetter<T>;
// When T is any - return AsyncMethodStubSetter<any, any>, otherwise return SynccMethodStubSetter<T>
export function when<T>(method: T): 0 extends (1 & T) ? AsyncMethodStubSetter<any, any> : SyncMethodStubSetter<T>;
export function when<T>(method: any): any {
    return new MethodStubSetter(method);
}

export function instance<T>(mockedValue: T): T {
    const tsmockitoInstance = (mockedValue as any).__tsmockitoInstance as T;
    return tsmockitoInstance;
}

export function capture<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7, i: T8, j: T9) => any): ArgCaptor10<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>;
export function capture<T0, T1, T2, T3, T4, T5, T6, T7, T8>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7, i: T8) => any): ArgCaptor9<T0, T1, T2, T3, T4, T5, T6, T7, T8>;
export function capture<T0, T1, T2, T3, T4, T5, T6, T7>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7) => any): ArgCaptor8<T0, T1, T2, T3, T4, T5, T6, T7>;
export function capture<T0, T1, T2, T3, T4, T5, T6>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6) => any): ArgCaptor7<T0, T1, T2, T3, T4, T5, T6>;
export function capture<T0, T1, T2, T3, T4, T5>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5) => any): ArgCaptor6<T0, T1, T2, T3, T4, T5>;
export function capture<T0, T1, T2, T3, T4>(method: (a: T0, b: T1, c: T2, d: T3, e: T4) => any): ArgCaptor5<T0, T1, T2, T3, T4>;
export function capture<T0, T1, T2, T3>(method: (a: T0, b: T1, c: T2, d: T3) => any): ArgCaptor4<T0, T1, T2, T3>;
export function capture<T0, T1, T2>(method: (a: T0, b: T1, c: T2) => any): ArgCaptor3<T0, T1, T2>;
export function capture<T0, T1>(method: (a: T0, b: T1) => any): ArgCaptor2<T0, T1>;
export function capture<T0>(method: (a: T0) => any): ArgCaptor1<T0>;
export function capture(method: (...args: any[]) => any): ArgCaptor {
    const methodStub: MethodToStub = method();
    if (methodStub instanceof MethodToStub) {
        methodStub.watcher.invoked();

        const actions = methodStub.mocker.getActionsByName(methodStub.methodName);
        return new ArgCaptor(actions);
    } else {
        throw Error("Cannot capture from not mocked object.");
    }
}

export function reset<T>(mockedValue: T): void {
    (mockedValue as any).__tsmockitoMocker.reset();
}

export function resetStubs<T>(mockedValue: T): void {
  (mockedValue as any).__tsmockitoMocker.resetStubs();
}

export function resetCalls<T>(mockedValue: T): void {
    (mockedValue as any).__tsmockitoMocker.resetCalls();
}

export function anyOfClass<T>(expectedClass: new (...args: any[]) => T): any {
    return new AnyOfClassMatcher(expectedClass) as any;
}

export function anyFunction<T>(): () => T {
    return new AnyFunctionMatcher() as any;
}

export function anyNumber(): number {
    return new AnyNumberMatcher() as any;
}

export function anyString(): string {
    return new AnyStringMatcher() as any;
}

export function anything(): any {
    return new AnythingMatcher() as any;
}

export const _ = anything();

export function between(min: number, max: number): number {
    return new BetweenMatcher(min, max) as any;
}

export function deepEqual<T>(expectedValue: T): T {
    return new DeepEqualMatcher(expectedValue) as any;
}

export function notNull(): any {
    return new NotNullMatcher() as any;
}

export function strictEqual<T>(expectedValue: T): T {
    return new StrictEqualMatcher(expectedValue) as any;
}

export function match(expectedValue: RegExp | string): string {
    return new MatchingStringMatcher(expectedValue) as any;
}

export function startsWith(expectedValue: string): string {
    return new StartsWithMatcher(expectedValue) as any;
}

export function endsWith(expectedValue: string): string {
    return new EndsWithMatcher(expectedValue) as any;
}

type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export function objectContaining<T>(expectedValue: RecursivePartial<T extends true ? T : T>): T {
    return new ObjectContainingMatcher(expectedValue) as any;
}

export type Deferred<T> = Promise<T> & {
    resolve: (value: T) => Promise<void>;
    reject: (err: any) => Promise<void>;
};

export function defer<T>(): Deferred<T> {
    let resolve: (value: T) => Promise<void>;
    let reject: (err: any) => Promise<void>;

    const d = new Promise<T>((res, rej) => {
        resolve = async (value: T) => res(value);
        reject = async (err: any) => rej(err);
    });
    return Object.assign(d, { resolve, reject });
}

export function nextTick(): Promise<void> {
    return new Promise(resolve => originalSetTimeout(() => originalSetImmediate(resolve), 0));
}

export function isAfter(date: MaybeDate): Date {
    return new IsAfterMatcher(date) as any;
}

export function isAfterOrEqual(date: MaybeDate): Date {
    return new IsAfterOrEqualMatcher(date) as any;
}

export function isBefore(date: MaybeDate): Date {
    return new IsBeforeMatcher(date) as any;
}

export function isBeforeOrEqual(date: MaybeDate): Date {
    return new IsBeforeOrEqualMatcher(date) as any;
}

export function greaterThan(value: number): number {
    return new GreaterThanMatcher(value) as any;
}

export function greaterThanOrEqual(value: number): number {
    return new GreaterThanOrEqualMatcher(value) as any;
}

export function lowerThan(value: number): number {
    return new LowerThanMatcher(value) as any;
}

export function lowerThanOrEqual(value: number): number {
    return new LowerThanOrEqualMatcher(value) as any;
}

// Export default object with all members (ember-browserify doesn't support named exports).
export default {
    spy,
    mock,
    imock,
    fnmock,
    cmock,
    verify,
    when,
    instance,
    capture,
    reset,
    resetStubs,
    resetCalls,
    anyOfClass,
    anyFunction,
    anyNumber,
    anyString,
    anything,
    _,
    between,
    deepEqual,
    notNull,
    strictEqual,
    match,
    startsWith,
    endsWith,
    objectContaining,
    MockPropertyPolicy,
    defer,
    nextTick,
    isAfter,
    isAfterOrEqual,
    isBefore,
    isBeforeOrEqual,
    greaterThan,
    greaterThanOrEqual,
    lowerThan,
    lowerThanOrEqual,
};
