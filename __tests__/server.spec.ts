import { app, server } from "../src/server";
import request from 'supertest';

describe("Router test suite", () => {

    it("verifies convert 200 response", done => {
        request(app).post("/api/convert")
            .send({"manifest":"test"})
            .expect('Content-Type', /json/)
            .expect(200, '{"kcc":{"error_summary":"resources not supported: {\\"test\\":{}}"},"tf":{"error_summary":"resources not supported: {\\"test\\":{}}"}}')
            .end(function (err, _res) {
                done(err);
            });
    });

    it("verifies convert 400 response", done => {
        request(app).post("/api/convert")
            .send({"manifest_wrong":"test"})
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, _res) {
                done(err);
            });
    });

    afterAll(() => {
        server.close();
    });
});