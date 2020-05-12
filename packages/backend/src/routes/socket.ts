import { Server } from "http";
import io from "socket.io";
import { StractGameSocketService } from "@stract/api";

export function setupSocket(server: Server) {
    const socketConnection = io(server);

    socketConnection.on("connection", socket => {
        const fromClient = StractGameSocketService.backend.fromClient(socket);
        const toClient = StractGameSocketService.backend.toClient(socket);

        fromClient.getGameUpdate((payload, socketMetadata) => {
            toClient.onGameUpdate({
                metadata: { name: "Sample game board", boardSize: { x: 10, y: 10 } },
                board: [[{ type: "free" }]],
            });
        });
    });
}
