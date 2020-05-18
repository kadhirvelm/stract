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
import { IGameAction, IPlayer, IRegisterPlayer, IStractGameV1, IPlayerIdentifier } from "../types";
import { IErrorMessage } from "../types/general";

enum MessageNames {
    ADD_STAGED_ACTION = "add-staged-action",
    GET_GAME_UPDATE = "get-game-update",
    ON_GAME_UPDATE = "on-game-update",
    ON_REGISTER_PLAYER = "on-register-player",
    REGISTER_PLAYER = "register-player",
    UNREGISTER_PLAYER = "unregister-player",
    ON_ERROR = "on-error",
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
        /**
         * Removes a player from the game so they can switch teams or change their name.
         */
        unregisterPlayer: IFromClientCallback<IPlayerIdentifier>;
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
        /**
         * Removes a player from the game so they can switch teams or change their name.
         */
        unregisterPlayer: IToClientCallback<IPlayerIdentifier>;
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
        onRegisterPlayerUpdate: IToServerCallback<IPlayer | undefined | null>;
        /**
         * Sends an error message to the client. Sometimes there will be an error code present that the frontend knows how to respond to.
         */
        onError: IToServerCallback<IErrorMessage>;
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
        onRegisterPlayerUpdate: IFromServerCallback<IPlayer | undefined | null>;
        /**
         * Sends an error message to the client. Sometimes there will be an error code present that the frontend knows how to respond to.
         */
        onError: IFromClientCallback<IErrorMessage>;
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
            unregisterPlayer: backendFromClient(socket, { messageName: MessageNames.UNREGISTER_PLAYER }),
        }),
        toClient: (socket: ServerSocket | Namespace) => ({
            onGameUpdate: backendToClient(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayerUpdate: backendToClient(socket, {
                messageName: MessageNames.ON_REGISTER_PLAYER,
            }),
            onError: backendToClient(socket, {
                messageName: MessageNames.ON_ERROR,
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
            unregisterPlayer: frontendToServer(socket, { messageName: MessageNames.UNREGISTER_PLAYER }),
        }),
        fromServer: (socket: typeof ClientSocket.Socket) => ({
            onGameUpdate: frontendFromServer(socket, {
                messageName: MessageNames.ON_GAME_UPDATE,
            }),
            onRegisterPlayerUpdate: frontendFromServer(socket, {
                messageName: MessageNames.ON_REGISTER_PLAYER,
            }),
            onError: frontendFromServer(socket, {
                messageName: MessageNames.ON_ERROR,
            }),
        }),
    },
};
