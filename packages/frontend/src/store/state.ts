import { IInterfaceState, EMPTY_INTERFACE_STATE } from "./interface/interfaceReducer";
import { IGameState, EMPTY_GAME_STATE } from "./game/gameReducer";

export interface IStoreState {
    game: IGameState;
    interface: IInterfaceState;
}

export const EMPTY_STATE: IStoreState = {
    game: EMPTY_GAME_STATE,
    interface: EMPTY_INTERFACE_STATE,
};
