import express from 'express';
import { Converter, ConvertOutputSet } from "./converter";

export class ConvertRoute {
    private converter = new Converter();

    public serve(req: express.Request, res: express.Response) {

        if (req.body && req.body.manifest) {
            const manifestString = req.body.manifest;
            this.converter.convert({ dmConfig: manifestString }, (output: ConvertOutputSet) => {
                this.sendResponse(
                    res,
                    200,
                    output);
            });
        } else {

            this.sendResponse(
                res,
                400,
                { "error_summary": "Cannot parse expanded config" });
        }
    }

    private sendResponse(res: express.Response, responseCode: number, payload: any) {
        res.status(responseCode);
        res.contentType("json");

        res.send(payload);
        res.end();
    }
}