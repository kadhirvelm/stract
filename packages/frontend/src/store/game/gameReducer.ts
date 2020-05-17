import { IStractGameV1 } from "@stract/api";
import { setWith, TypedReducer } from "redoodle";
import { getPlayer, ILastPong, IPlayerWithTeamKey } from "../../utils";
import { maybeAddTeamKeyToPlayer } from "../../utils/maybeAddTeamKeyToPlayer";
import { RegisterPlayer, UpdateGameBoard, UpdateSocketHealth } from "./gameActions";

export interface IGameState {
    gameBoard?: IStractGameV1;
    lastPong?: ILastPong;
    player?: IPlayerWithTeamKey;
}

export const EMPTY_GAME_STATE: IGameState = {
    player: getPlayer(),
};

export const gameReducer = TypedReducer.builder<IGameState>()
    .withHandler(UpdateGameBoard.TYPE, (state, gameBoard) =>
        setWith(state, { gameBoard, player: maybeAddTeamKeyToPlayer(gameBoard, state.player) }),
    )
    .withHandler(RegisterPlayer.TYPE, (state, player) =>
        setWith(state, { player: maybeAddTeamKeyToPlayer(state.gameBoard, player) }),
    )
    .withHandler(UpdateSocketHealth.TYPE, (state, lastPong) => setWith(state, { lastPong }))
    .build();
