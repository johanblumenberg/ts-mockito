export abstract class AbstractMethodStub {
    constructor(
        protected groupIndex: number,
        protected oneshot: boolean,
    ) {}

    public isOneshot(): boolean {
        return this.oneshot;
    }

    public getGroupIndex(): number {
        return this.groupIndex;
    }
}
