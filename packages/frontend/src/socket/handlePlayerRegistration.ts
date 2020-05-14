import { IPlayer, IStractFromServer, IStractToServer } from "@stract/api";
import { Dispatch } from "redux";
import { RegisterPlayer } from "../store";

let existingPlayer: IPlayer | undefined;
function setCurrentPlayer(newPlayer: IPlayer) {
    existingPlayer = newPlayer;
}

function registerPlayer(toServer: IStractToServer["toServer"]) {
    return () => {
        if (existingPlayer === undefined) {
            return;
        }

        toServer.registerPlayer(existingPlayer);
    };
}

export function handlePlayerRegistration(
    fromServer: IStractFromServer["fromServer"],
    toServer: IStractToServer["toServer"],
    socket: SocketIOClient.Socket,
    dispatch: Dispatch,
) {
    fromServer.onRegisterPlayer(player => {
        setCurrentPlayer(player);
        dispatch(RegisterPlayer.create(player));
    });

    socket.on("connect", registerPlayer(toServer));
}
