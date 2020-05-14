import { Socket as ServerSocket, Namespace } from "socket.io";
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
import { IStractGameV1, IGameAction, IPlayer } from "../types";

enum MessageNames {
    ADD_STAGED_ACTION = "add-staged-action",
    GET_GAME_UPDATE = "get-game-update",
    ON_GAME_UPDATE = "on-game-update",
    ON_REGISTER_PLAYER = "on-register-player",
    REGISTER_PLAYER = "register-player",
}

export interface IStractToServer {
    fromClient: {
        addStagedAction: IFromClientCallback<IGameAction>;
        getGameUpdate: IFromClientCallback<{}>;
        registerPlayer: IFromClientCallback<IPlayer>;
    };
    toServer: {
        addStagedAction: IToClientCallback<IGameAction>;
        getGameUpdate: IToClientCallback<{}>;
        registerPlayer: IToClientCallback<IPlayer>;
    };
}

export interface IStractFromServer {
    toClient: {
        onGameUpdate: IToServerCallback<IStractGameV1>;
        onRegisterPlayer: IToServerCallback<IPlayer>;
    };
    fromServer: {
        onGameUpdate: IFromServerCallback<IStractGameV1>;
        onRegisterPlayer: IFromServerCallback<IPlayer>;
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
            addStagedAction: backendFromClient<IGameAction>(socket, { messageName: MessageNames.ADD_STAGED_ACTION }),
            getGameUpdate: backendFromClient<{}>(socket, { messageName: MessageNames.GET_GAME_UPDATE }),
            registerPlayer: backendFromClient<IPlayer>(socket, { messageName: MessageNames.REGISTER_PLAYER }),
        }),
        toClient: (socket: ServerSocket | Namespace) => ({
            onGameUpdate: backendToClient<IStractGameV1>(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayer: backendToClient<IPlayer>(socket, { messageName: MessageNames.ON_REGISTER_PLAYER }),
        }),
    },
    frontend: {
        toServer: (socket: typeof ClientSocket.Socket, socketMetadata: ISocketMessageMetadata) => ({
            addStagedAction: frontendToServer<IGameAction>(socket, {
                messageName: MessageNames.ADD_STAGED_ACTION,
                socketMetadata,
            }),
            getGameUpdate: frontendToServer<{}>(socket, { messageName: MessageNames.GET_GAME_UPDATE, socketMetadata }),
            registerPlayer: frontendToServer<IPlayer>(socket, {
                messageName: MessageNames.REGISTER_PLAYER,
                socketMetadata,
            }),
        }),
        fromServer: (socket: typeof ClientSocket.Socket) => ({
            onGameUpdate: frontendFromServer<IStractGameV1>(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayer: frontendFromServer<IPlayer>(socket, {
                messageName: MessageNames.ON_REGISTER_PLAYER,
            }),
        }),
    },
};
