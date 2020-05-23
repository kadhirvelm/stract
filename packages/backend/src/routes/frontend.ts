import express from "express";
import { join } from "path";

export function setReactRoutes(app: express.Express) {
    if (process.env.NODE_ENV === "production") {
        app.get("*.js", (req, res, next) => {
            req.url = `${req.url}.gz`;
            res.set("Content-Encoding", "gzip");
            res.set("Content-Type", "text/javascript");
            next();
        });

        app.get("*.css", (req, res, next) => {
            req.url = `${req.url}.gz`;
            res.set("Content-Encoding", "gzip");
            res.set("Content-Type", "text/css");
            next();
        });

        app.get("*.json", (req, res, next) => {
            req.url = `${req.url}.gz`;
            res.set("Content-Encoding", "gzip");
            res.set("Content-Type", "application/json");
            next();
        });
    }

    app.use(express.static(join(process.cwd(), "../frontend/dist"), { extensions: ["html"] }));
    app.use(express.static(join(process.cwd(), "../frontend/public")));
    app.use(express.static(join(process.cwd(), "../frontend/static")));
}
