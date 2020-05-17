import { IStractFromServer, IStractToServer } from "@stract/api";
import { Dispatch } from "redux";
import { RegisterPlayer } from "../store";
import { getPlayer, storePlayer } from "../utils/sessionStorage";
import { showToast } from "../utils/showToast";

function registerPlayer(toServer: IStractToServer["toServer"]) {
    return () => {
        const existingPlayer = getPlayer();
        if (existingPlayer == null) {
            toServer.getGameUpdate({});
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
    fromServer.onRegisterPlayerUpdate(player => {
        const normalizedPlayer = player ?? undefined;

        storePlayer(normalizedPlayer);
        dispatch(RegisterPlayer.create(normalizedPlayer));

        if (normalizedPlayer === undefined) {
            showToast({
                intent: "danger",
                message: "Oh no! The game you're connected to has ended. Please connect to a new one.",
            });
        }

        toServer.getGameUpdate({});
    });

    socket.on("connect", registerPlayer(toServer));
}
