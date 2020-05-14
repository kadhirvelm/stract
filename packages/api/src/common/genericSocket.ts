import { Socket as ServerSocket, Namespace } from "socket.io";
import * as ClientSocket from "socket.io-client";

export interface ISocketMessage {
    messageName: string;
}

export function backendFromClient<Input>(socket: ServerSocket, socketMessage: ISocketMessage) {
    return (callback: (payload: Input) => void) => {
        socket.on(socketMessage.messageName, callback);
    };
}

export function frontendToServer<Input>(socket: typeof ClientSocket.Socket, socketMessage: ISocketMessage) {
    return (payload: Input) => {
        socket.emit(socketMessage.messageName, payload);
    };
}

export function backendToClient<Input>(socket: ServerSocket | Namespace, socketMessage: ISocketMessage) {
    return (payload: Input) => {
        socket.emit(socketMessage.messageName, payload);
    };
}

export function frontendFromServer<Input>(socket: typeof ClientSocket.Socket, socketMessage: ISocketMessage) {
    return (callback: (payload: Input) => void) => {
        socket.on(socketMessage.messageName, callback);
    };
}

export type IFromClientCallback<T> = (callback: (payload: T) => void) => void;
export interface IFromClient {
    [messageName: string]: IFromClientCallback<any>;
}

export type IToClientCallback<T> = (payload: T) => void;
export interface IToClient {
    [messageName: string]: IToClientCallback<any>;
}

export type IToServerCallback<T> = (payload: T) => void;
export interface IToServer {
    [messageName: string]: IToServerCallback<any>;
}

export type IFromServerCallback<T> = (callback: (payload: T) => void) => void;
export interface IFromServer {
    [messageName: string]: IFromServerCallback<any>;
}

export interface ISocketService<
    FromClient extends IFromClient,
    ToClient extends IToClient,
    ToServer extends IToServer,
    FromServer extends IFromServer
> {
    backend: {
        fromClient: (socket: ServerSocket) => FromClient;
        toClient: (socket: ServerSocket | Namespace) => ToClient;
    };
    frontend: {
        toServer: (socket: typeof ClientSocket.Socket) => ToServer;
        fromServer: (socket: typeof ClientSocket.Socket) => FromServer;
    };
}
