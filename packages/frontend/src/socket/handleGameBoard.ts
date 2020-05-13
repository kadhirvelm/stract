import { Dispatch } from "redux";
import { IStractFromServer, IStractGameV1 } from "@stract/api";
import { UpdateGameBoard } from "../store";

export function handleGameBoard(dispatch: Dispatch, fromServer: IStractFromServer["fromServer"]) {
    fromServer.onGameUpdate((gameBoard: IStractGameV1) => {
        dispatch(UpdateGameBoard.create(gameBoard));
    });
}
