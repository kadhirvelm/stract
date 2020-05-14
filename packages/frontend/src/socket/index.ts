import { ISocketMessageMetadata, IStractToServer, ORIGIN, PORT, StractGameSocketService } from "@stract/api";
import { Dispatch } from "redux";
import io from "socket.io-client";
import { handleGameBoard } from "./handleGameBoard";
import { handleReconnects } from "./handlePlayer";

let toServer: IStractToServer["toServer"] | undefined;

export function sendServerMessage() {
    if (toServer === undefined) {
        throw new Error("Attempted to fetch an invalid toServer action.");
    }

    return toServer;
}

const socketMetadata: ISocketMessageMetadata = {};

export function instantiateStractGameSocketListener(dispatch: Dispatch) {
    return new Promise(resolve => {
        const socket = io(`http://${ORIGIN}:${PORT}/sample-game-room`);

        const fromServer = StractGameSocketService.frontend.fromServer(socket);
        handleGameBoard(dispatch, fromServer);

        toServer = StractGameSocketService.frontend.toServer(socket, socketMetadata);
        handleReconnects(fromServer, toServer, socket, dispatch);

        resolve({});
    });
}
