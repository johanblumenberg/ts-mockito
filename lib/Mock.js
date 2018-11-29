"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Matcher_1 = require("./matcher/type/Matcher");
var MethodAction_1 = require("./MethodAction");
var MethodStubCollection_1 = require("./MethodStubCollection");
var MethodToStub_1 = require("./MethodToStub");
var ReturnValueMethodStub_1 = require("./stub/ReturnValueMethodStub");
var ts_mockito_1 = require("./ts-mockito");
var MockableFunctionsFinder_1 = require("./utils/MockableFunctionsFinder");
var ObjectInspector_1 = require("./utils/ObjectInspector");
var ObjectPropertyCodeRetriever_1 = require("./utils/ObjectPropertyCodeRetriever");
var MockPropertyPolicy;
(function (MockPropertyPolicy) {
    MockPropertyPolicy[MockPropertyPolicy["StubAsProperty"] = 0] = "StubAsProperty";
    MockPropertyPolicy[MockPropertyPolicy["StubAsMethod"] = 1] = "StubAsMethod";
    MockPropertyPolicy[MockPropertyPolicy["Throw"] = 2] = "Throw";
})(MockPropertyPolicy = exports.MockPropertyPolicy || (exports.MockPropertyPolicy = {}));
var Mocker = (function () {
    function Mocker(clazz, policy, instance) {
        if (instance === void 0) { instance = {}; }
        this.clazz = clazz;
        this.instance = instance;
        this.objectInspector = new ObjectInspector_1.ObjectInspector();
        this.methodStubCollections = {};
        this.methodActions = [];
        this.mock = {};
        this.mockableFunctionsFinder = new MockableFunctionsFinder_1.MockableFunctionsFinder();
        this.objectPropertyCodeRetriever = new ObjectPropertyCodeRetriever_1.ObjectPropertyCodeRetriever();
        this.mock.__policy = policy;
        this.mock.__tsmockitoInstance = this.instance;
        this.mock.__tsmockitoMocker = this;
        if (_.isObject(this.clazz) && _.isObject(this.instance)) {
            this.processProperties(this.clazz.prototype);
            this.processClassCode(this.clazz);
            this.processFunctionsCode(this.clazz.prototype);
        }
        if (typeof Proxy !== "undefined") {
            this.mock.__tsmockitoInstance = new Proxy(this.instance, this.createCatchAllHandlerForRemainingPropertiesWithoutGetters("instance"));
        }
    }
    Mocker.prototype.getMock = function () {
        if (typeof Proxy === "undefined") {
            return this.mock;
        }
        return new Proxy(this.mock, this.createCatchAllHandlerForRemainingPropertiesWithoutGetters("expectation"));
    };
    Mocker.prototype.createCatchAllHandlerForRemainingPropertiesWithoutGetters = function (origin) {
        var _this = this;
        return {
            get: function (target, name) {
                var hasMethodStub = name in target;
                if (!hasMethodStub) {
                    if (origin === "instance") {
                        if (_this.mock.__policy === MockPropertyPolicy.StubAsMethod) {
                            if (name !== "then") {
                                _this.createMethodStub(name.toString());
                                _this.createInstanceActionListener(name.toString(), {});
                            }
                        }
                        else if (_this.mock.__policy === MockPropertyPolicy.StubAsProperty) {
                            _this.createPropertyStub(name.toString());
                            _this.createInstancePropertyDescriptorListener(name.toString(), {}, _this.clazz.prototype);
                        }
                        else if (_this.mock.__policy === MockPropertyPolicy.Throw) {
                            throw new Error("Trying to read property " + name.toString() + " from a mock object, which was not expected.");
                        }
                        else {
                            throw new Error("Invalid MockPolicy value");
                        }
                    }
                    else if (origin === "expectation") {
                        _this.createMixedStub(name.toString());
                    }
                }
                return target[name];
            },
        };
    };
    Mocker.prototype.reset = function () {
        this.methodStubCollections = {};
        this.methodActions = [];
    };
    Mocker.prototype.resetCalls = function () {
        this.methodActions = [];
    };
    Mocker.prototype.getAllMatchingActions = function (methodName, matchers) {
        var result = [];
        this.methodActions.forEach(function (item) {
            if (item.isApplicable(methodName, matchers)) {
                result.push(item);
            }
        });
        return result;
    };
    Mocker.prototype.getFirstMatchingAction = function (methodName, matchers) {
        return this.getAllMatchingActions(methodName, matchers)[0];
    };
    Mocker.prototype.getActionsByName = function (name) {
        return this.methodActions.filter(function (action) { return action.methodName === name; });
    };
    Mocker.prototype.processProperties = function (object) {
        var _this = this;
        this.objectInspector.getObjectPrototypes(object).forEach(function (obj) {
            _this.objectInspector.getObjectOwnPropertyNames(obj).forEach(function (name) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, name);
                if (descriptor.get) {
                    _this.createPropertyStub(name);
                    _this.createInstancePropertyDescriptorListener(name, descriptor, obj);
                }
                else if (typeof descriptor.value === "function") {
                    _this.createMethodStub(name);
                    _this.createInstanceActionListener(name, obj);
                }
                else {
                }
            });
        });
    };
    Mocker.prototype.createInstancePropertyDescriptorListener = function (key, descriptor, prototype) {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }
        Object.defineProperty(this.instance, key, {
            get: this.createActionListener(key),
        });
    };
    Mocker.prototype.createInstanceActionListener = function (key, prototype) {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }
        this.instance[key] = this.createActionListener(key);
    };
    Mocker.prototype.createActionListener = function (key) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var action = new MethodAction_1.MethodAction(key, args);
            _this.methodActions.push(action);
            var methodStub = _this.getMethodStub(key, args);
            methodStub.execute(args);
            return methodStub.getValue();
        };
    };
    Mocker.prototype.getEmptyMethodStub = function (key, args) {
        return new ReturnValueMethodStub_1.ReturnValueMethodStub(-1, [], null);
    };
    Mocker.prototype.processClassCode = function (clazz) {
        var _this = this;
        var classCode = typeof clazz.toString !== "undefined" ? clazz.toString() : "";
        var functionNames = this.mockableFunctionsFinder.find(classCode);
        functionNames.forEach(function (functionName) {
            _this.createMethodStub(functionName);
            _this.createInstanceActionListener(functionName, _this.clazz.prototype);
        });
    };
    Mocker.prototype.processFunctionsCode = function (object) {
        var _this = this;
        this.objectInspector.getObjectPrototypes(object).forEach(function (obj) {
            _this.objectInspector.getObjectOwnPropertyNames(obj).forEach(function (propertyName) {
                var functionNames = _this.mockableFunctionsFinder.find(_this.objectPropertyCodeRetriever.get(obj, propertyName));
                functionNames.forEach(function (functionName) {
                    _this.createMethodStub(functionName);
                    _this.createInstanceActionListener(functionName, _this.clazz.prototype);
                });
            });
        });
    };
    Mocker.prototype.createMixedStub = function (key) {
        var _this = this;
        if (this.mock.hasOwnProperty(key)) {
            return;
        }
        var isProperty = true;
        Object.defineProperty(this.instance, key, {
            get: function () {
                if (isProperty) {
                    return _this.createActionListener(key)();
                }
                else {
                    return _this.createActionListener(key);
                }
            },
        });
        var methodMock = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            isProperty = false;
            var matchers = [];
            for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
                var arg = args_1[_a];
                if (!(arg instanceof Matcher_1.Matcher)) {
                    matchers.push(ts_mockito_1.strictEqual(arg));
                }
                else {
                    matchers.push(arg);
                }
            }
            return new MethodToStub_1.MethodToStub(_this.methodStubCollections[key], matchers, _this, key);
        };
        var propertyMock = function () {
            if (!_this.methodStubCollections[key]) {
                _this.methodStubCollections[key] = new MethodStubCollection_1.MethodStubCollection();
            }
            return Object.assign(methodMock, new MethodToStub_1.MethodToStub(_this.methodStubCollections[key], [], _this, key));
        };
        Object.defineProperty(this.mock, key, {
            get: propertyMock,
        });
    };
    Mocker.prototype.createPropertyStub = function (key) {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }
        Object.defineProperty(this.mock, key, {
            get: this.createMethodToStub(key),
        });
    };
    Mocker.prototype.createMethodStub = function (key) {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }
        this.mock[key] = this.createMethodToStub(key);
    };
    Mocker.prototype.createMethodToStub = function (key) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!_this.methodStubCollections[key]) {
                _this.methodStubCollections[key] = new MethodStubCollection_1.MethodStubCollection();
            }
            var matchers = [];
            for (var _a = 0, args_2 = args; _a < args_2.length; _a++) {
                var arg = args_2[_a];
                if (!(arg instanceof Matcher_1.Matcher)) {
                    matchers.push(ts_mockito_1.strictEqual(arg));
                }
                else {
                    matchers.push(arg);
                }
            }
            return new MethodToStub_1.MethodToStub(_this.methodStubCollections[key], matchers, _this, key);
        };
    };
    Mocker.prototype.getMethodStub = function (key, args) {
        var methodStub = this.methodStubCollections[key];
        if (methodStub && methodStub.hasMatchingInAnyGroup(args)) {
            var groupIndex = methodStub.getLastMatchingGroupIndex(args);
            return methodStub.getFirstMatchingFromGroupAndRemoveIfNotLast(groupIndex, args);
        }
        else {
            return this.getEmptyMethodStub(key, args);
        }
    };
    return Mocker;
}());
exports.Mocker = Mocker;
//# sourceMappingURL=Mock.js.map