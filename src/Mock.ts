import * as _ from "lodash";
import {Matcher} from "./matcher/type/Matcher";
import {MethodAction} from "./MethodAction";
import {MethodStubCollection} from "./MethodStubCollection";
import {MethodToStub} from "./MethodToStub";
import {MethodStub} from "./stub/MethodStub";
import {ReturnValueMethodStub} from "./stub/ReturnValueMethodStub";
import {strictEqual} from "./ts-mockito";
import {MockableFunctionsFinder} from "./utils/MockableFunctionsFinder";
import {ObjectInspector} from "./utils/ObjectInspector";
import {ObjectPropertyCodeRetriever} from "./utils/ObjectPropertyCodeRetriever";

export class Mocker {
    public mock: any = {};
    protected objectInspector = new ObjectInspector();
    private methodStubCollections: any = {};
    private methodActions: MethodAction[] = [];
    private excludedPropertyNames: string[] = ["hasOwnProperty"];
    private defaultedPropertyNames: string[] = ["Symbol(Symbol.toPrimitive)", "then", "catch"];

    constructor(private clazz: any, public instance: any = {}) {
        this.mock.__tsmockitoInstance = this.instance;
        this.mock.__tsmockitoMocker = this;

        if (typeof Proxy !== "undefined") {
          this.mock.__tsmockitoInstance = new Proxy(
              this.instance,
              this.createCatchAllHandlerForRemainingPropertiesWithoutGetters(),
          );
        }
    }

    public getMock(): any {
        if (typeof Proxy === "undefined") {
            return this.mock;
        } else {
            return new Proxy(
              this.mock,
              this.createCatchAllHandlerForMock(),
            );
        }
    }

    public reset(): void {
        this.methodStubCollections = {};
        this.methodActions = [];
    }

    public resetCalls(): void {
        this.methodActions = [];
    }

    public getAllMatchingActions(methodName: string, matchers: Array<Matcher>): Array<MethodAction> {
        const result: MethodAction[] = [];

        this.methodActions.forEach((item: MethodAction) => {
            if (item.isApplicable(methodName, matchers)) {
                result.push(item);
            }
        });
        return result;
    }

    public getFirstMatchingAction(methodName: string, matchers: Array<Matcher>): MethodAction {
        return this.getAllMatchingActions(methodName, matchers)[0];
    }

    public getActionsByName(name: string): MethodAction[] {
        return this.methodActions.filter(action => action.methodName === name);
    }

    protected processProperties(object: any): void {
        this.objectInspector.getObjectPrototypes(object).forEach((obj: any) => {
            this.objectInspector.getObjectOwnPropertyNames(obj).forEach((name: string) => {
                if (this.excludedPropertyNames.indexOf(name) >= 0) {
                    return;
                }
                const descriptor = Object.getOwnPropertyDescriptor(obj, name);
                if (descriptor.get) {
                    this.createPropertyStub(name);
                    this.createInstancePropertyDescriptorListener(name, descriptor, obj);
                    this.createInstanceActionListener(name, obj);
                } else if (typeof descriptor.value === "function") {
                    this.createMethodStub(name);
                    this.createInstanceActionListener(name, obj);
                } else {
                    // no need to reassign properties
                }
            });
        });
    }

    protected createInstancePropertyDescriptorListener(key: string,
                                                       descriptor: PropertyDescriptor,
                                                       prototype: any): void {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }

        Object.defineProperty(this.instance, key, {
            get: this.createActionListener(key),
        });
    }

    protected createInstanceActionListener(key: string, prototype: any): void {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }

        this.instance[key] = this.createActionListener(key);
    }

    protected createActionListener(key: string): () => any {
        return (...args) => {
            const action: MethodAction = new MethodAction(key, args);
            this.methodActions.push(action);
            const methodStub = this.getMethodStub(key, args);
            methodStub.execute(args);
            return methodStub.getValue();
        };
    }

    protected getEmptyMethodStub(key: string, args: any[]): MethodStub {
        return new ReturnValueMethodStub(-1, [], null);
    }

    protected createMethodStub(key) {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }

        this.mock[key] = this.createMethodToStub(key);
    }

    private createCatchAllHandlerForRemainingPropertiesWithoutGetters(): any {
        return {
            get: (target: any, name: PropertyKey) => {
                if (this.excludedPropertyNames.indexOf(name.toString()) >= 0) {
                    return target[name];
                }

                if (!(name in target)) {
                    if (this.defaultedPropertyNames.indexOf(name.toString()) >= 0) {
                        return undefined;
                    }
                    if (this.clazz) {
                      // If mocking a class, class method are populated in the constructor
                      // Assume that all other properties are not methods
                      this.createPropertyStub(name.toString());
                      this.createInstancePropertyDescriptorListener(name.toString(), {}, this.clazz.prototype);
                    } else {
                      // If mocking an interface, no class methods are populated in the constructor
                      // Assume that all properties are methods
                      this.createMethodStub(name);
                      this.createInstanceActionListener(name.toString(), target);
                    }
                }
                return target[name];
            },
        };
    }

    private createCatchAllHandlerForMock(): any {
        return {
            get: (target: any, name: PropertyKey) => {
                if (!(name in target)) {
                    this.createMethodStub(name);
                    this.createInstanceActionListener(name.toString(), target);
                }
                return target[name];
            },
        };
    }

    private createPropertyStub(key: string): void {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }

        Object.defineProperty(this.mock, key, {
            get: this.createMethodToStub(key),
        });
    }

    private createMethodToStub(key: string): () => any {
        return (...args: Array<any>) => {
            if (args.length === 1 && args[0] === "__tsMockitoGetInfo") {
                return {
                    key,
                    mocker: this,
                };
            }
            if (!this.methodStubCollections[key]) {
                this.methodStubCollections[key] = new MethodStubCollection();
            }

            const matchers: Matcher[] = [];

            for (const arg of args) {
                if (!(arg instanceof Matcher)) {
                    matchers.push(strictEqual(arg));
                } else {
                    matchers.push(arg);
                }
            }

            return new MethodToStub(this.methodStubCollections[key], matchers, this, key);
        };
    }

    private getMethodStub(key: string, args: any[]): MethodStub {
        const methodStub: MethodStubCollection = this.methodStubCollections[key];
        if (methodStub && methodStub.hasMatchingInAnyGroup(args)) {
            const groupIndex = methodStub.getLastMatchingGroupIndex(args);
            return methodStub.getFirstMatchingFromGroupAndRemoveIfNotLast(groupIndex, args);
        } else {
            return this.getEmptyMethodStub(key, args);
        }
    }
}

export class Mock extends Mocker {
  private mockableFunctionsFinder = new MockableFunctionsFinder();
  private objectPropertyCodeRetriever = new ObjectPropertyCodeRetriever();

  constructor(clazz: any) {
    super(clazz);

    if (_.isObject(clazz)) {
        this.processProperties((clazz as any).prototype);
        this.processClassCode(clazz);
        this.processFunctionsCode((clazz as any).prototype);
    }
  }

  private processClassCode(clazz: any): void {
    const classCode = typeof clazz.toString !== "undefined" ? clazz.toString() : "";
    const functionNames = this.mockableFunctionsFinder.find(classCode);
    functionNames.forEach((functionName: string) => {
        this.createMethodStub(functionName);
        this.createInstanceActionListener(functionName, clazz.prototype);
    });
  }

  private processFunctionsCode(object: any): void {
      this.objectInspector.getObjectPrototypes(object).forEach((obj: any) => {
          this.objectInspector.getObjectOwnPropertyNames(obj).forEach((propertyName: string) => {
              const functionNames = this.mockableFunctionsFinder.find(this.objectPropertyCodeRetriever.get(obj, propertyName));
              functionNames.forEach((functionName: string) => {
                  this.createMethodStub(functionName);
                  this.createInstanceActionListener(functionName, object);
              });
          });
      });
  }
}
