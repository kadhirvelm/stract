import { Dispatch } from "redux";
import { IStractFromServer, IStractGame } from "@stract/api";
import { UpdateGameBoard } from "../store";

export function handleGameBoard(dispatch: Dispatch, fromServer: IStractFromServer["fromServer"]) {
    fromServer.onGameUpdate((gameBoard: IStractGame) => {
        dispatch(UpdateGameBoard.create(gameBoard));
    });
}
