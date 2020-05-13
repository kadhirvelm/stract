import { Socket as ServerSocket } from "socket.io";
import * as ClientSocket from "socket.io-client";
import {
    ISocketService,
    backendFromClient,
    ISocketMessageMetadata,
    frontendToServer,
    backendToClient,
    frontendFromServer,
    IFromServerCallback,
    IToServerCallback,
    IFromClientCallback,
    IToClientCallback,
} from "../common/genericSocket";
import { IStractGame, IGameAction } from "../types";

enum MessageNames {
    GET_GAME_UPDATE = "get-game-update",
    ADD_STAGED_ACTION = "add-staged-action",
    ON_GAME_UPDATE = "on-game-update",
}

export interface IStractToServer {
    fromClient: {
        getGameUpdate: IFromClientCallback<{}>;
        addStagedAction: IFromClientCallback<IGameAction>;
    };
    toServer: {
        getGameUpdate: IToClientCallback<{}>;
        addStagedAction: IToClientCallback<IGameAction>;
    };
}

export interface IStractFromServer {
    toClient: {
        onGameUpdate: IToServerCallback<IStractGame>;
    };
    fromServer: {
        onGameUpdate: IFromServerCallback<IStractGame>;
    };
}

export const StractGameSocketService: ISocketService<
    IStractToServer["fromClient"],
    IStractFromServer["toClient"],
    IStractToServer["toServer"],
    IStractFromServer["fromServer"]
> = {
    backend: {
        fromClient: (socket: ServerSocket) => ({
            getGameUpdate: backendFromClient<{}>(socket, { messageName: MessageNames.GET_GAME_UPDATE }),
            addStagedAction: backendFromClient<IGameAction>(socket, { messageName: MessageNames.ADD_STAGED_ACTION }),
        }),
        toClient: (socket: ServerSocket) => ({
            onGameUpdate: backendToClient<IStractGame>(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
        }),
    },
    frontend: {
        toServer: (socket: typeof ClientSocket.Socket, socketMetadata: ISocketMessageMetadata) => ({
            getGameUpdate: frontendToServer<{}>(socket, { messageName: MessageNames.GET_GAME_UPDATE, socketMetadata }),
            addStagedAction: frontendToServer<IGameAction>(socket, {
                messageName: MessageNames.ADD_STAGED_ACTION,
                socketMetadata,
            }),
        }),
        fromServer: (socket: typeof ClientSocket.Socket) => ({
            onGameUpdate: frontendFromServer<IStractGame>(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
        }),
    },
};
