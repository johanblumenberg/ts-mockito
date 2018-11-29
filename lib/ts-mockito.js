"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgCaptor_1 = require("./capture/ArgCaptor");
var AnyFunctionMatcher_1 = require("./matcher/type/AnyFunctionMatcher");
var AnyNumberMatcher_1 = require("./matcher/type/AnyNumberMatcher");
var AnyOfClassMatcher_1 = require("./matcher/type/AnyOfClassMatcher");
var AnyStringMatcher_1 = require("./matcher/type/AnyStringMatcher");
var AnythingMatcher_1 = require("./matcher/type/AnythingMatcher");
var BetweenMatcher_1 = require("./matcher/type/BetweenMatcher");
var DeepEqualMatcher_1 = require("./matcher/type/DeepEqualMatcher");
var MatchingStringMatcher_1 = require("./matcher/type/MatchingStringMatcher");
var NotNullMatcher_1 = require("./matcher/type/NotNullMatcher");
var ObjectContainingMatcher_1 = require("./matcher/type/ObjectContainingMatcher");
var StrictEqualMatcher_1 = require("./matcher/type/StrictEqualMatcher");
var MethodStubSetter_1 = require("./MethodStubSetter");
var MethodStubVerificator_1 = require("./MethodStubVerificator");
var MethodToStub_1 = require("./MethodToStub");
var Mock_1 = require("./Mock");
var Spy_1 = require("./Spy");
var Mock_2 = require("./Mock");
exports.MockPropertyPolicy = Mock_2.MockPropertyPolicy;
function spy(instanceToSpy) {
    return new Spy_1.Spy(instanceToSpy).getMock();
}
exports.spy = spy;
function mock(clazz, policy) {
    if (policy === void 0) { policy = Mock_1.MockPropertyPolicy.StubAsProperty; }
    return new Mock_1.Mocker(clazz, policy).getMock();
}
exports.mock = mock;
function imock(policy) {
    if (policy === void 0) { policy = Mock_1.MockPropertyPolicy.StubAsMethod; }
    var Empty = (function () {
        function Empty() {
        }
        return Empty;
    }());
    var mockedValue = new Mock_1.Mocker(Empty, policy).getMock();
    if (typeof Proxy === "undefined") {
        throw new Error("Mocking of interfaces requires support for Proxy objects");
    }
    var tsmockitoMocker = mockedValue.__tsmockitoMocker;
    return new Proxy(mockedValue, tsmockitoMocker.createCatchAllHandlerForRemainingPropertiesWithoutGetters("expectation"));
}
exports.imock = imock;
function verify(method) {
    return new MethodStubVerificator_1.MethodStubVerificator(method);
}
exports.verify = verify;
function when(method) {
    return new MethodStubSetter_1.MethodStubSetter(method);
}
exports.when = when;
function instance(mockedValue) {
    var tsmockitoInstance = mockedValue.__tsmockitoInstance;
    return tsmockitoInstance;
}
exports.instance = instance;
function capture(method) {
    var methodStub = method();
    if (methodStub instanceof MethodToStub_1.MethodToStub) {
        var actions = methodStub.mocker.getActionsByName(methodStub.methodName);
        return new ArgCaptor_1.ArgCaptor(actions);
    }
    else {
        throw Error("Cannot capture from not mocked object.");
    }
}
exports.capture = capture;
function reset(mockedValue) {
    mockedValue.__tsmockitoMocker.reset();
}
exports.reset = reset;
function resetCalls(mockedValue) {
    mockedValue.__tsmockitoMocker.resetCalls();
}
exports.resetCalls = resetCalls;
function anyOfClass(expectedClass) {
    return new AnyOfClassMatcher_1.AnyOfClassMatcher(expectedClass);
}
exports.anyOfClass = anyOfClass;
function anyFunction() {
    return new AnyFunctionMatcher_1.AnyFunctionMatcher();
}
exports.anyFunction = anyFunction;
function anyNumber() {
    return new AnyNumberMatcher_1.AnyNumberMatcher();
}
exports.anyNumber = anyNumber;
function anyString() {
    return new AnyStringMatcher_1.AnyStringMatcher();
}
exports.anyString = anyString;
function anything() {
    return new AnythingMatcher_1.AnythingMatcher();
}
exports.anything = anything;
function between(min, max) {
    return new BetweenMatcher_1.BetweenMatcher(min, max);
}
exports.between = between;
function deepEqual(expectedValue) {
    return new DeepEqualMatcher_1.DeepEqualMatcher(expectedValue);
}
exports.deepEqual = deepEqual;
function notNull() {
    return new NotNullMatcher_1.NotNullMatcher();
}
exports.notNull = notNull;
function strictEqual(expectedValue) {
    return new StrictEqualMatcher_1.StrictEqualMatcher(expectedValue);
}
exports.strictEqual = strictEqual;
function match(expectedValue) {
    return new MatchingStringMatcher_1.MatchingStringMatcher(expectedValue);
}
exports.match = match;
function objectContaining(expectedValue) {
    return new ObjectContainingMatcher_1.ObjectContainingMatcher(expectedValue);
}
exports.objectContaining = objectContaining;
exports.default = {
    spy: spy,
    mock: mock,
    imock: imock,
    verify: verify,
    when: when,
    instance: instance,
    capture: capture,
    reset: reset,
    resetCalls: resetCalls,
    anyOfClass: anyOfClass,
    anyFunction: anyFunction,
    anyNumber: anyNumber,
    anyString: anyString,
    anything: anything,
    between: between,
    deepEqual: deepEqual,
    notNull: notNull,
    strictEqual: strictEqual,
    match: match,
    objectContaining: objectContaining,
    MockPropertyPolicy: Mock_1.MockPropertyPolicy,
};
//# sourceMappingURL=ts-mockito.js.map