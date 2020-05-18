import { Dispatch } from "redux";
import { IStractFromServer, IStractGameV1, IErrorMessage } from "@stract/api";
import { UpdateGameBoard } from "../store";
import { showToast } from "../utils/showToast";

export function handleGame(dispatch: Dispatch, fromServer: IStractFromServer["fromServer"]) {
    fromServer.onGameUpdate((gameBoard: IStractGameV1) => {
        dispatch(UpdateGameBoard.create(gameBoard));
    });

    fromServer.onMessage((error: IErrorMessage) => {
        const { message, intent } = error;
        showToast({ message, intent });
    });
}
