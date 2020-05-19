export interface IGameStateNotStarted {
    type: "not-started";
}

export interface IGameStateRequestPlay {
    type: "request-play";
}

export interface IGameStateInPlay {
    nextTurnTimestamp: number;
    type: "in-play";
}

export interface IGameStateRequestPause {
    nextTurnTimestamp: number;
    type: "request-pause";
}

export interface IGameStatePaused {
    type: "paused";
}

export interface IGameStateEnded {
    type: "ended";
}

export type IGameState =
    | IGameStateNotStarted
    | IGameStateRequestPlay
    | IGameStateInPlay
    | IGameStateRequestPause
    | IGameStatePaused
    | IGameStateEnded;

export interface IGameStateVisitor<T = any> {
    notStarted: (gameState: IGameStateNotStarted) => T;
    requestPlay: (gameState: IGameStateRequestPlay) => T;
    inPlay: (gameState: IGameStateInPlay) => T;
    requestPause: (gameState: IGameStateRequestPause) => T;
    paused: (gameState: IGameStatePaused) => T;
    ended: (gameState: IGameStateEnded) => T;
    unknown: (gameState: IGameState) => T;
}

export namespace IGameState {
    export const notStarted = (): IGameStateNotStarted => ({ type: "not-started" });
    export const requestPlay = (): IGameStateRequestPlay => ({ type: "request-play" });
    export const inPlay = (nextTurnTimestamp: number): IGameStateInPlay => ({ nextTurnTimestamp, type: "in-play" });
    export const requestPause = (nextTurnTimestamp: number): IGameStateRequestPause => ({
        nextTurnTimestamp,
        type: "request-pause",
    });
    export const paused = (): IGameStatePaused => ({ type: "paused" });
    export const ended = (): IGameStateEnded => ({ type: "ended" });

    export const isNotStarted = (gameState: IGameState): gameState is IGameStateNotStarted =>
        gameState.type === "not-started";
    export const isRequestPlay = (gameState: IGameState): gameState is IGameStateRequestPlay =>
        gameState.type === "request-play";
    export const isInPlay = (gameState: IGameState): gameState is IGameStateInPlay => gameState.type === "in-play";
    export const isRequestPause = (gameState: IGameState): gameState is IGameStateRequestPause =>
        gameState.type === "request-pause";
    export const isPaused = (gameState: IGameState): gameState is IGameStatePaused => gameState.type === "paused";
    export const isEnded = (gameState: IGameState): gameState is IGameStateEnded => gameState.type === "ended";

    export const visit = <T = any>(gameState: IGameState, callbacks: IGameStateVisitor<T>) => {
        if (isNotStarted(gameState)) {
            return callbacks.notStarted(gameState);
        }

        if (isRequestPlay(gameState)) {
            return callbacks.requestPlay(gameState);
        }

        if (isInPlay(gameState)) {
            return callbacks.inPlay(gameState);
        }

        if (isRequestPause(gameState)) {
            return callbacks.requestPause(gameState);
        }

        if (isPaused(gameState)) {
            return callbacks.paused(gameState);
        }

        if (isEnded(gameState)) {
            return callbacks.ended(gameState);
        }

        return callbacks.unknown(gameState);
    };
}
