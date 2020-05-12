import express from "express";
import { SampleService } from "@stract/api";

export function setupSampleRoute(app: express.Express) {
    const { method, endpoint, implementation } = SampleService.getSampleData.backend;

    app[method](endpoint, (_, res) => {
        implementation({ label: "string" }, res, (label: { label: string }) => {
            return new Promise(resolve => resolve(label));
        });
    });
}
