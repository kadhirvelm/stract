import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AnyAction, Store } from "redux";
import { Game } from "./game";
import "./index.scss";
import { configureStore, IStoreState } from "./store";

const store = configureStore() as Store<IStoreState, AnyAction>;

ReactDOM.render(
    <Provider store={store}>
        <Game storeDispatch={store.dispatch} />
    </Provider>,
    document.getElementById("main-app"),
);
