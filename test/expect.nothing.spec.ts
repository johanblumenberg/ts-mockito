import {anyNumber, mock, originalExpectNothing, verify} from "../src/ts-mockito";
import {Foo} from "./utils/Foo";

describe("using verify without expect", () => {
    let mockedFoo: Foo;

    beforeEach(() => {
        mockedFoo = mock(Foo);
    });

    describe("environment without expect", () => {
            const originalExpect = expect;

        beforeAll(() => {
            delete globalThis["expect"];
        });

        it("should not cause an error", () => {
            originalExpectNothing();

            verify(mockedFoo.convertNumberToString(anyNumber())).never();
        });

        afterAll(() => {
            globalThis.expect = originalExpect;
        });
    });

    describe("environment with expect", () => {
        it("should not warn about no expectations", () => {
            verify(mockedFoo.convertNumberToString(anyNumber())).never();
        });
    });
});
