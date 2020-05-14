import { Namespace, Socket as ServerSocket } from "socket.io";
import * as ClientSocket from "socket.io-client";
import {
    backendFromClient,
    backendToClient,
    frontendFromServer,
    frontendToServer,
    IFromClientCallback,
    IFromServerCallback,
    ISocketService,
    IToClientCallback,
    IToServerCallback,
} from "../common/genericSocket";
import { IGameAction, IPlayer, IRegisterPlayer, IStractGameV1 } from "../types";

enum MessageNames {
    ADD_STAGED_ACTION = "add-staged-action",
    GET_GAME_UPDATE = "get-game-update",
    ON_GAME_UPDATE = "on-game-update",
    ON_REGISTER_PLAYER = "on-register-player",
    REGISTER_PLAYER = "register-player",
}

export interface IStractToServer {
    fromClient: {
        /**
         * A player has requested they want to add a staged action to their team's actions for the turn.
         */
        addStagedAction: IFromClientCallback<IGameAction>;
        /**
         * A player has requested the current game state.
         */
        getGameUpdate: IFromClientCallback<{}>;
        /**
         * A player has requested to register with the game.
         */
        registerPlayer: IFromClientCallback<IRegisterPlayer>;
    };
    toServer: {
        /**
         * Request to add a staged action for the current turn.
         */
        addStagedAction: IToClientCallback<IGameAction>;
        /**
         * Request the current game state.
         */
        getGameUpdate: IToClientCallback<{}>;
        /**
         * Request to register with the game.
         */
        registerPlayer: IToClientCallback<IRegisterPlayer>;
    };
}

export interface IStractFromServer {
    toClient: {
        /**
         * Sends a game update to the client.
         */
        onGameUpdate: IToServerCallback<IStractGameV1>;
        /**
         * If a player has successfully registered (or re-registered) with the game, replies with the latest player registration. It will
         * return undefined if the game the player is connecting to no longer exists.
         */
        onRegisterPlayer: IToServerCallback<IPlayer | undefined | null>;
    };
    fromServer: {
        /**
         * The latest game state.
         */
        onGameUpdate: IFromServerCallback<IStractGameV1>;
        /**
         * The player's registration. This message is sent when a player successfully registers (or re-registers) with the game. It will
         * return undefined if the game the player is connecting to no longer exists.
         */
        onRegisterPlayer: IFromServerCallback<IPlayer | undefined | null>;
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
            addStagedAction: backendFromClient(socket, { messageName: MessageNames.ADD_STAGED_ACTION }),
            getGameUpdate: backendFromClient(socket, { messageName: MessageNames.GET_GAME_UPDATE }),
            registerPlayer: backendFromClient(socket, { messageName: MessageNames.REGISTER_PLAYER }),
        }),
        toClient: (socket: ServerSocket | Namespace) => ({
            onGameUpdate: backendToClient(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayer: backendToClient(socket, {
                messageName: MessageNames.ON_REGISTER_PLAYER,
            }),
        }),
    },
    frontend: {
        toServer: (socket: typeof ClientSocket.Socket) => ({
            addStagedAction: frontendToServer(socket, {
                messageName: MessageNames.ADD_STAGED_ACTION,
            }),
            getGameUpdate: frontendToServer(socket, { messageName: MessageNames.GET_GAME_UPDATE }),
            registerPlayer: frontendToServer(socket, {
                messageName: MessageNames.REGISTER_PLAYER,
            }),
        }),
        fromServer: (socket: typeof ClientSocket.Socket) => ({
            onGameUpdate: frontendFromServer(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayer: frontendFromServer(socket, {
                messageName: MessageNames.ON_REGISTER_PLAYER,
            }),
        }),
    },
};
