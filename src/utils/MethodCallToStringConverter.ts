import {Matcher} from "../matcher/type/Matcher";
import {MethodToStub} from "../MethodToStub";
import { MethodAction } from "../MethodAction";

export class MethodCallToStringConverter {
    public convert(method: MethodToStub): string {
        method.watcher.invoked();

        const stringifiedMatchers = method.matchers.map((matcher: Matcher) => matcher.toString()).join(", ");
        return `${method.methodName}(${stringifiedMatchers})" `;
    }

    public convertActualCalls(calls: MethodAction[]): string[] {
        return calls.map(call => call.methodName + '(' + call.args.map(arg => arg.toString()).join(', ') + ')');
    }
}
