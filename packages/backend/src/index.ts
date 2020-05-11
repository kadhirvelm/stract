import { ORIGIN, PORT, SampleService } from "@stract/api";
import compression from "compression";
import express from "express";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

app.use(compression());

configureSecurity(app);

app[SampleService.getSampleData.method](SampleService.getSampleData.endpoint, (_, res) => {
    SampleService.getSampleData.backend({ label: "string" }, res, (label: { label: string }) => {
        return new Promise(resolve => resolve(label));
    });
});

app.listen(PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
