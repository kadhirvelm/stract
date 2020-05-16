import { TypedReducer, setWith } from "redoodle";
import { IStractGameV1, IPlayer } from "@stract/api";
import { UpdateGameBoard, RegisterPlayer, UpdateSocketHealth } from "./gameActions";
import { getPlayer, ILastPong } from "../../utils";

export interface IGameState {
    gameBoard?: IStractGameV1;
    lastPong?: ILastPong;
    player?: IPlayer;
}

export const EMPTY_GAME_STATE: IGameState = {
    player: getPlayer(),
};

export const gameReducer = TypedReducer.builder<IGameState>()
    .withHandler(UpdateGameBoard.TYPE, (state, gameBoard) => setWith(state, { gameBoard }))
    .withHandler(RegisterPlayer.TYPE, (state, player) => setWith(state, { player }))
    .withHandler(UpdateSocketHealth.TYPE, (state, lastPong) => setWith(state, { lastPong }))
    .build();
