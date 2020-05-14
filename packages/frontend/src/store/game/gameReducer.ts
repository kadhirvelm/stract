import { TypedReducer, setWith } from "redoodle";
import { IStractGameV1, IPlayer } from "@stract/api";
import { UpdateGameBoard, RegisterPlayer } from "./gameActions";
import { getPlayer } from "../../utils";

export interface IGameState {
    gameBoard?: IStractGameV1;
    player?: IPlayer;
}

export const EMPTY_GAME_STATE: IGameState = {
    player: getPlayer(),
};

export const gameReducer = TypedReducer.builder<IGameState>()
    .withHandler(UpdateGameBoard.TYPE, (state, gameBoard) => setWith(state, { gameBoard }))
    .withHandler(RegisterPlayer.TYPE, (state, player) => setWith(state, { player }))
    .build();
