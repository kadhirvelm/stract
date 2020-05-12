import { TypedReducer, setWith } from "redoodle";
import { IStractGame } from "@stract/api";
import { UpdateGameBoard } from "./gameActions";

export interface IGameState {
    gameBoard?: IStractGame;
}

export const EMPTY_GAME_STATE: IGameState = {};

export const gameReducer = TypedReducer.builder<IGameState>()
    .withHandler(UpdateGameBoard.TYPE, (state, gameBoard) => setWith(state, { gameBoard }))
    .build();
