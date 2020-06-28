import express from 'express';

export class ConvertRoute {

    public serve(_req: express.Request, res: express.Response) {
        this.sendResponse(
            res,
            400,
            { "error_summary": "cannot convert to Config Connector" },
            { "error_summary": "cannot convert to Terraform" });
    }

    private sendResponse(res: express.Response, responseCode: number, kccPayload: any, tfPayload: any) {
        res.status(responseCode);
        res.contentType("json");

        res.send({ kcc: kccPayload, tf: tfPayload });
        res.end();
    }
}