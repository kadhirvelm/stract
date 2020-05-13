import { combineReducers } from "redoodle";
import { IStoreState } from "./state";
import { gameReducer } from "./game/gameReducer";
import { interfaceReducer } from "./interface/interfaceReducer";

export const reducer = combineReducers<IStoreState>({
    game: gameReducer,
    interface: interfaceReducer,
});
