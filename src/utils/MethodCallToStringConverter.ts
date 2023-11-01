import {Matcher} from "../matcher/type/Matcher";
import {MethodToStub} from "../MethodToStub";
import { MethodAction } from "../MethodAction";

function argToString(arg: any): string {
    const type = typeof arg;

    if (type === "string") {
        return `"${arg}"`;
    } else if (!arg || type === "number") {
        return String(arg);
    } else {
        return JSON.stringify(arg);
    }
}

export class MethodCallToStringConverter {
    public static convert(method: MethodToStub): string {
        method.watcher.invoked();

        const stringifiedMatchers = method.matchers.map((matcher: Matcher) => matcher.toString()).join(", ");
        return `${method.methodName}(${stringifiedMatchers})" `;
    }

    public static convertActualCalls(calls: MethodAction[]): string[] {
        return calls.map(call => call.methodName + "(" + call.args.map(argToString).join(", ") + ")");
    }
}
