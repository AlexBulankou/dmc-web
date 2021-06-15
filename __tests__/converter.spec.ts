import { Converter, ConvertOutputSet } from "../src/converter";
import fs from "fs";
import path from "path";

describe("Converter test suite", () => {

    it("verifies simple converter scenario", done => {

        const readTestFile = (fileName: string): string => {
            return fs.readFileSync(path.resolve(__dirname, `./test_deployments/${fileName}`), { encoding: 'utf8', flag: 'r' });
        };

        const conveter = new Converter();

        const dmInput: string = readTestFile("test1_dm.yaml");
        const expectedKRMOutput: string = readTestFile("test1_krm.yaml");
        const expectedTFOutput: string = readTestFile("test1_tf.tf");

        conveter.convert({ dmConfig: dmInput }, (output: ConvertOutputSet) => {
            expect(output.fsError).toBeUndefined();
            expect(output.krmOutput.retCode).toEqual(0);
            expect(output.krmOutput.retSignal).toBeUndefined();
            expect(output.krmOutput.convertedOutput).toBe(expectedKRMOutput);
            expect(output.krmOutput.stdout).toEqual("");
            // expect(output.krmOutput.stderr).toEqual("hello");

            expect(output.tfOutput.retCode).toEqual(0);
            expect(output.tfOutput.retSignal).toBeUndefined();
            expect(output.tfOutput.convertedOutput).toBe(expectedTFOutput);
            expect(output.tfOutput.stdout).toEqual("");
            // expect(output.tfOutput.stderr).toEqual("hello");
            done();
        });
    });

});
