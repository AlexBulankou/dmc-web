import express from 'express';
import yaml = require('yamljs');

export class ConvertRoute {

    public serve(req: express.Request, res: express.Response) {
        const parsingErrors: string[] = [];
        const resources: { [name: string]: any; } = {};

        const getResourcesResult = this.getResources(req, parsingErrors, resources);
        if (getResourcesResult) {

            this.sendResponse(
                res,
                200,
                { "error_summary": "resources not supported: " + JSON.stringify(resources) },
                { "error_summary": "resources not supported: " + JSON.stringify(resources) });

        } else {
            this.sendResponse(
                res,
                400,
                { "error_summary": "cannot convert to Config Connector. " + JSON.stringify(parsingErrors) },
                { "error_summary": "cannot convert to Terraform. " + JSON.stringify(parsingErrors) });
        }
    }

    private getResources(req: express.Request, parsingErrors: string[], resources: { [name: string]: any; }): boolean {
        const manifestString = req.body.manifest;

        if (!manifestString) {
            parsingErrors.push("Request data empty");
            return false;
        }

        let manifestObjects = [];
        try {
            manifestObjects = yaml.parse(manifestString);
        }
        catch (e) {
            parsingErrors.push(e.toString());
            return false;
        }

        if (!manifestObjects) {
            parsingErrors.push("Could not parse yaml manifest");
            return false;
        }

        resources["test"] = {};
        return true;
    }

    private sendResponse(res: express.Response, responseCode: number, kccPayload: any, tfPayload: any) {
        res.status(responseCode);
        res.contentType("json");

        res.send({ kcc: kccPayload, tf: tfPayload });
        res.end();
    }
}