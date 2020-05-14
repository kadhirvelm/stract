import { Server } from "http";
import { StractGame } from "../game/stractGame";

export function setupGameSocket(server: Server) {
    return new StractGame(server, "sample-game-room");
}
