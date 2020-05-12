import express from "express";
import { Server } from "http";
import { setupSampleRoute } from "./sampleRoute";
import { setupGameSocket } from "./gameSocket";
import { setReactRoutes } from "./frontend";

export function setupRoutes(app: express.Express, server: Server) {
    setReactRoutes(app);
    setupSampleRoute(app);
    setupGameSocket(server);

    app.get("/", (_, res) => {
        res.sendFile("/index.html");
    });
}
