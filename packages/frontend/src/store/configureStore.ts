import { applyMiddleware } from "redux";
import { Store, loggingMiddleware, createStore, reduceCompoundActions } from "redoodle";
import { IStoreState, EMPTY_STATE } from "./state";
import { reducer } from "./reducer";

export function configureStore(): Store<IStoreState> {
    const logging = applyMiddleware(loggingMiddleware({ prettyPrintSingleActions: true })) as any;
    const initialState: IStoreState = EMPTY_STATE;

    return createStore<IStoreState>(reduceCompoundActions(reducer), initialState, logging);
}
