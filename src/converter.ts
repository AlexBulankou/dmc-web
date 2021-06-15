import { exec, ExecException } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

interface ConvertInput {
    dmConfig: string;
};

interface ConvertOutputSet {
    fsError?: Error;
    tmpPath?: string;
    tfOutput?: ConvertOutput;
    krmOutput?: ConvertOutput;
};

interface ConvertOutput {
    timestampStart: number;
    timestampFinish?: number;
    stdout?: string;
    stderr?: string;
    retCode?: number;
    retSignal?: string;
    convertedOutput?: string;
};



class Converter {
    //private dockerHelpCommand = "docker run us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview --helpshort";

    private getConvertCommand(workingFolder: string, format: "TF" | "KRM", outputFileName: string): string {
        return `docker run  \
        -v ${workingFolder}:/mnt \
        --rm \
        us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview \
        --config /mnt/deployment.yaml \
        --project_id [PROJECT_ID] \
        --project_number 0 \
        --output_format ${format} \
        --output_file /mnt/${outputFileName} \
        --verbose \
        --deployment_name [DEPLOYMENT_NAME]`;
    }

    convert(input: ConvertInput, callback: (output: ConvertOutputSet) => void): void {
        const output: ConvertOutputSet = {};
        fs.mkdtemp(path.join(os.tmpdir(), "convert"), (fsError: Error, folder: string) => {
            if (fsError) {
                output.fsError = fsError;
                callback(output);
            } else {
                output.tmpPath = folder;
                const inputFilePath: string = `${folder}/deployment.yaml`
                const outputTFFileName = "tf_output.tf";
                const outputKRMFileName = "krm_output.yaml";

                const outputTFFilePath: string = `${folder}/${outputTFFileName}`;
                const outputKRMFilePath: string = `${folder}/${outputKRMFileName}`;

                fs.writeFile(inputFilePath, input.dmConfig, (fileWriteError: Error) => {
                    if (fileWriteError) {
                        output.fsError = fileWriteError;
                        callback(output);
                    } else {
                        let tfConversionCompleted = false;
                        let krmConversionCompleted = false;

                        output.tfOutput = { timestampStart: Date.now() };
                        exec(this.getConvertCommand(folder, "TF", outputTFFileName), (execError: ExecException, stdout: string, stderr: string) => {
                            output.tfOutput.timestampFinish = Date.now();
                            tfConversionCompleted = true;
                            if (execError) {
                                output.tfOutput.retCode = execError.code;
                                output.tfOutput.retSignal = execError.signal;
                            } else {
                                output.tfOutput.retCode = 0;
                            }

                            output.tfOutput.stderr = stderr;
                            output.tfOutput.stdout = stdout;
                            if (fs.existsSync(outputTFFilePath)) {
                                output.tfOutput.convertedOutput = fs.readFileSync(outputTFFilePath, { encoding: 'utf8', flag: 'r' });
                            } else {
                                output.tfOutput.convertedOutput = "";
                            }
                            if (krmConversionCompleted && tfConversionCompleted) {
                                callback(output);
                            }

                        });

                        output.krmOutput = { timestampStart: Date.now() };
                        exec(this.getConvertCommand(folder, "KRM", outputKRMFileName), (execError: ExecException, stdout: string, stderr: string) => {
                            output.krmOutput.timestampFinish = Date.now();
                            krmConversionCompleted = true;

                            if (execError) {
                                output.krmOutput.retCode = execError.code;
                                output.krmOutput.retSignal = execError.signal;
                            } else {
                                output.krmOutput.retCode = 0;
                            }
                            output.krmOutput.stderr = stderr;
                            output.krmOutput.stdout = stdout;
                            if (fs.existsSync(outputKRMFilePath)) {
                                output.krmOutput.convertedOutput = fs.readFileSync(outputKRMFilePath, { encoding: 'utf8', flag: 'r' });
                            } else {
                                output.krmOutput.convertedOutput = "";
                            }
                            if (krmConversionCompleted && tfConversionCompleted) {
                                callback(output);
                            }
                        });
                    }
                });
            }
        });


    }
}

export { ConvertInput, ConvertOutput, ConvertOutputSet, Converter };