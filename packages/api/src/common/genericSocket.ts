import { Socket as ServerSocket } from "socket.io";
import * as ClientSocket from "socket.io-client";
import { Brand, createBrandedGeneric } from "./brandType";

export interface INoMetadataSocketMessage {
    messageName: string;
}

export type ISocketIdentifer = Brand<string, "socket-id">;
export const socketId = createBrandedGeneric<string, ISocketIdentifer>();

export interface ISocketMessageMetadata {
    socketIdentifier: ISocketIdentifer;
}

export interface IWithMetadataSocketMessage extends INoMetadataSocketMessage {
    socketMetadata: ISocketMessageMetadata;
}

export function backendFromClient<Input>(socket: ServerSocket, socketMessage: INoMetadataSocketMessage) {
    return (callback: (payload: Input, socketMetadata: ISocketMessageMetadata) => void) => {
        socket.on(socketMessage.messageName, callback);
    };
}

export function frontendToServer<Input>(socket: typeof ClientSocket.Socket, socketMessage: IWithMetadataSocketMessage) {
    return (payload: Input) => {
        socket.emit(socketMessage.messageName, payload, socketMessage.socketMetadata);
    };
}

export function backendToClient<Input>(socket: ServerSocket, socketMessage: INoMetadataSocketMessage) {
    return (payload: Input) => {
        socket.emit(socketMessage.messageName, payload);
    };
}

export function frontendFromServer<Input>(socket: typeof ClientSocket.Socket, socketMessage: INoMetadataSocketMessage) {
    return (callback: (payload: Input) => void) => {
        socket.on(socketMessage.messageName, callback);
    };
}

export type IFromClientCallback<T> = (callback: (payload: T, socketMetadata: ISocketMessageMetadata) => void) => void;
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
        toClient: (socket: ServerSocket) => ToClient;
    };
    frontend: {
        toServer: (socket: typeof ClientSocket.Socket, socketMetadata: ISocketMessageMetadata) => ToServer;
        fromServer: (socket: typeof ClientSocket.Socket) => FromServer;
    };
}
