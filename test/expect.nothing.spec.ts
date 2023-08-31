import {anyNumber, mock, verify} from "../src/ts-mockito";
import {Foo} from "./utils/Foo";
import * as cp from "child_process";

describe("#nodejs using verify without expect", () => {
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
            verify(mockedFoo.convertNumberToString(anyNumber())).never();
        });

        afterAll(() => {
            globalThis.expect = originalExpect;
        });
    });

    describe("environment with expect", () => {
        it("should not cause an error", () => {
            verify(mockedFoo.convertNumberToString(anyNumber())).never();
        });

        it("should not warn about no expectations", (done) => {
            cp.exec("karma start karma.conf.js --single-run --reporters kjhtml --tags expect-nothing-fixture", (error, stdout, stderr) => {
                expect(error).toBe(null);
                expect(stdout).not.toContain("has no expectations");

                done();
            });
        });
    });

    describe("#expect-nothing-fixture", () => {
        let mockedFoo: Foo;

        beforeEach(() => {
            mockedFoo = mock(Foo);
        });

        it("should not warn about no expectations", () => {
          verify(mockedFoo.convertNumberToString(anyNumber())).never();
        });
    });
});
