import { IStractToServer, ORIGIN, PORT, StractGameSocketService } from "@stract/api";
import { Dispatch } from "redux";
import io from "socket.io-client";
import { handleGameBoard } from "./handleGameBoard";
import { handlePlayerRegistration } from "./handlePlayerRegistration";
import { UpdateSocketHealth } from "../store";

let toServer: IStractToServer["toServer"] | undefined;

export function sendServerMessage() {
    if (toServer === undefined) {
        throw new Error("Attempted to fetch an invalid toServer action.");
    }

    return toServer;
}

export function instantiateStractGameSocketListener(dispatch: Dispatch) {
    const socket = io(`http://${ORIGIN}:${PORT}/sample-game-room`, { forceNew: true, reconnectionDelay: 500 });

    const fromServer = StractGameSocketService.frontend.fromServer(socket);

    toServer = StractGameSocketService.frontend.toServer(socket);
    handleGameBoard(dispatch, fromServer);

    handlePlayerRegistration(fromServer, toServer, socket, dispatch);

    socket.on("pong", (latency: number) => dispatch(UpdateSocketHealth.create({ latency, timeStamp: new Date() })));
}
