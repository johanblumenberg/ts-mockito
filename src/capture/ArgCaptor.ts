import {MethodAction} from "../MethodAction";

export class ArgCaptor<T extends any[]> {
    constructor(private actions: MethodAction[]) {
    }

    public first(): T {
        return this.byCallIndex(0);
    }

    public second(): T {
        return this.byCallIndex(1);
    }

    public third(): T {
        return this.byCallIndex(2);
    }

    public beforeLast(): T {
        return this.byCallIndex(this.actions.length - 2);
    }

    public last(): T {
        return this.byCallIndex(this.actions.length - 1);
    }

    public byCallIndex(index: number): T {
        if (index >= this.actions.length) {
            throw new Error(`Cannot capture arguments, method has not been called so many times: ${index + 1}`);
        }
        return this.actions[index].args as T;
    }
}
