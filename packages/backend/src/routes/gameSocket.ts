import { Server } from "http";
import io from "socket.io";
import { StractGameSocketService, IStractGameTile } from "@stract/api";
import _ from "lodash";

function createBoard(x: number, y: number): IStractGameTile[][] {
    return _.range(0, x).map(() => _.range(0, y).map(() => ({ type: "free" })));
}

export function setupGameSocket(server: Server) {
    const socketConnection = io(server);

    socketConnection.on("connection", socket => {
        const fromClient = StractGameSocketService.backend.fromClient(socket);
        const toClient = StractGameSocketService.backend.toClient(socket);

        console.log("Socket connected", socket.id);

        fromClient.getGameUpdate(() => {
            toClient.onGameUpdate({
                metadata: { name: "Sample game board", boardSize: { x: 10, y: 10 } },
                board: createBoard(10, 10),
            });
        });
    });
}
