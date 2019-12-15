import {MethodToStub} from "./MethodToStub";
import {MethodCallToStringConverter} from "./utils/MethodCallToStringConverter";

// Save reference to setTimeout, in case tests are mocking time functions
const localSetTimeout = setTimeout;

export class MethodStubVerificator<T> {
    private methodCallToStringConverter: MethodCallToStringConverter = new MethodCallToStringConverter();

    private actualCalls() {
        const calls = this.methodToVerify.mocker.getActionsByName(this.methodToVerify.methodName);
        return 'Actual calls:\n  ' + this.methodCallToStringConverter.convertActualCalls(calls).join('\n  ');
    }

    constructor(private methodToVerify: MethodToStub) {
        methodToVerify.watcher.invoked();
    }

    public called(): void {
        this.atLeast(1);
    }

    public never(): void {
        this.times(0);
    }

    public once(): void {
        this.times(1);
    }

    public twice(): void {
        this.times(2);
    }

    public thrice(): void {
        this.times(3);
    }

    public times(value: number): void {
        const allMatchingActions = this.methodToVerify.mocker.getAllMatchingActions(this.methodToVerify.methodName, this.methodToVerify.matchers);
        if (value !== allMatchingActions.length) {
            const methodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);            
            const msg = `Expected "${methodToVerifyAsString}to be called ${value} time(s). But has been called ${allMatchingActions.length} time(s).`;
            throw new Error(msg + '\n' + this.actualCalls());
        }
    }

    public atLeast(value: number): void {
        const allMatchingActions = this.methodToVerify.mocker.getAllMatchingActions(this.methodToVerify.methodName, this.methodToVerify.matchers);
        if (value > allMatchingActions.length) {
            const methodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);
            const msg = `Expected "${methodToVerifyAsString}to be called at least ${value} time(s). But has been called ${allMatchingActions.length} time(s).`;
            throw new Error(msg + '\n' + this.actualCalls());
        }
    }

    public atMost(value: number): void {
        const allMatchingActions = this.methodToVerify.mocker.getAllMatchingActions(this.methodToVerify.methodName, this.methodToVerify.matchers);
        if (value < allMatchingActions.length) {
            const methodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);
            const msg = `Expected "${methodToVerifyAsString}to be called at most ${value} time(s). But has been called ${allMatchingActions.length} time(s).`;
            throw new Error(msg + '\n' + this.actualCalls());
        }
    }

    public calledBefore(method: any): void {
        method.watcher.invoked();

        const firstMethodAction = this.methodToVerify.mocker.getFirstMatchingAction(this.methodToVerify.methodName, this.methodToVerify.matchers);
        const secondMethodAction = method.mocker.getFirstMatchingAction(method.methodName, method.matchers);
        const mainMethodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);
        const secondMethodAsString = this.methodCallToStringConverter.convert(method);
        const errorBeginning = `Expected "${mainMethodToVerifyAsString} to be called before ${secondMethodAsString}`;

        if (firstMethodAction && secondMethodAction) {
            if (!firstMethodAction.hasBeenCalledBefore(secondMethodAction)) {
                throw new Error(`${errorBeginning}but has been called after.`);
            }
        } else if (firstMethodAction && !secondMethodAction) {
            throw new Error(`${errorBeginning}but ${secondMethodAsString}has never been called.`);
        } else if (!firstMethodAction && secondMethodAction) {
            throw new Error(`${errorBeginning}but ${mainMethodToVerifyAsString}has never been called.`);
        } else {
            throw new Error(`${errorBeginning}but none of them has been called.`);
        }
    }

    public calledAfter(method: any): void {
        method.watcher.invoked();

        const firstMethodAction = this.methodToVerify.mocker.getFirstMatchingAction(this.methodToVerify.methodName  , this.methodToVerify.matchers);
        const secondMethodAction = method.mocker.getFirstMatchingAction(method.methodName, method.matchers);
        const mainMethodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);
        const secondMethodAsString = this.methodCallToStringConverter.convert(method);
        const errorBeginning = `Expected "${mainMethodToVerifyAsString}to be called after ${secondMethodAsString}`;

        if (firstMethodAction && secondMethodAction) {
            if (firstMethodAction.hasBeenCalledBefore(secondMethodAction)) {
                throw new Error(`${errorBeginning}but has been called before.`);
            }
        } else if (firstMethodAction && !secondMethodAction) {
            throw new Error(`${errorBeginning}but ${secondMethodAsString}has never been called.`);
        } else if (!firstMethodAction && secondMethodAction) {
            throw new Error(`${errorBeginning}but ${mainMethodToVerifyAsString}has never been called.`);
        } else {
            throw new Error(`${errorBeginning}but none of them has been called.`);
        }
    }

    public timeout(ms: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const expired = Date.now() + ms;

            const check = () => {
                const allMatchingActions = this.methodToVerify.mocker.getAllMatchingActions(this.methodToVerify.methodName, this.methodToVerify.matchers);

                if (allMatchingActions.length > 0) {
                    resolve();
                } else if (Date.now() >= expired) {
                    const methodToVerifyAsString = this.methodCallToStringConverter.convert(this.methodToVerify);
                    reject(new Error(`Expected "${methodToVerifyAsString}to be called within ${ms} ms.`));
                } else {
                    localSetTimeout(check, 1);
                }
            };

            check();
        });
    }
}
