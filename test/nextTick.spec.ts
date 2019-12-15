import {nextTick} from "../src/ts-mockito";

describe("nextTick", () => {
    it('should execute after setImmediate()', async () => {
        let done = false;

        setImmediate(() => done = true);

        await nextTick();
        expect(done).toBe(true);
    });

    it('should execute after setTimeout(0)', async () => {
        let done = false;

        setTimeout(() => done = true, 0);

        await nextTick();
        expect(done).toBe(true);
    });

    it('should execute after promise', async () => {
        let done = false;

        Promise.resolve().then(() => done = true);

        await nextTick();
        expect(done).toBe(true);
    });
});
