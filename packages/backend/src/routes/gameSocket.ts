import { Server } from "http";
import { IStractGameV1 } from "@stract/api";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { StractGame } from "../game/stractGame";

const savedGamePath = join(process.cwd(), "../../.stract-game");

function saveGame(currentGameState: IStractGameV1) {
    try {
        const savedJson = JSON.stringify(currentGameState, null, 2);
        writeFileSync(savedGamePath, savedJson);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Attempted to save the game, but errored out.", e);
    }
}

function maybeGetSavedGame(): IStractGameV1 | undefined {
    try {
        return JSON.parse(readFileSync(savedGamePath)?.toString());
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Attempted to get the saved game, but errored out.");
        return undefined;
    }
}

export function setupGameSocket(server: Server) {
    return new StractGame(server, "sample-game-room", maybeGetSavedGame(), saveGame);
}
