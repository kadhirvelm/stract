import { ISocketMessageMetadata, IStractToServer, ORIGIN, PORT, StractGameSocketService } from "@stract/api";
import { Dispatch } from "redux";
import io from "socket.io-client";
import { v4 } from "uuid";
import { handleGameBoard } from "./handleGameBoard";

const socketMetadata: ISocketMessageMetadata = {
    socketIdentifier: v4(),
};

let toServer: IStractToServer["toServer"] | undefined;

export function instantiateStractGameSocketListener(dispatch: Dispatch) {
    return new Promise(resolve => {
        const socket = io(`http://${ORIGIN}:${PORT}/`);

        const fromServer = StractGameSocketService.frontend.fromServer(socket);
        handleGameBoard(dispatch, fromServer);

        toServer = StractGameSocketService.frontend.toServer(socket, socketMetadata);
        resolve({});
    });
}

export function sendServerMessage() {
    if (toServer === undefined) {
        throw new Error("Attempted to fetch an invalid toServer action.");
    }

    return toServer;
}
