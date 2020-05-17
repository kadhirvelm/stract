export interface IGameStateNotStarted {
    type: "not-started";
}

export interface IGameStateInPlay {
    type: "in-play";
}

export interface IGameStatePaused {
    type: "paused";
}

export interface IGameStateEnded {
    type: "ended";
}

export type IGameState = IGameStateNotStarted | IGameStateInPlay | IGameStatePaused | IGameStateEnded;

export interface IGameStateVisitor<T = any> {
    notStarted: (gameState: IGameStateNotStarted) => T;
    inPlay: (gameState: IGameStateInPlay) => T;
    paused: (gameState: IGameStatePaused) => T;
    ended: (gameState: IGameStateEnded) => T;
    unknown: (gameState: IGameState) => T;
}

export namespace IGameState {
    export const notStarted = (): IGameStateNotStarted => ({ type: "not-started" });
    export const inPlay = (): IGameStateInPlay => ({ type: "in-play" });
    export const paused = (): IGameStatePaused => ({ type: "paused" });
    export const ended = (): IGameStateEnded => ({ type: "ended" });

    export const isNotStarted = (gameState: IGameState): gameState is IGameStateNotStarted =>
        gameState.type === "not-started";
    export const isInPlay = (gameState: IGameState): gameState is IGameStateInPlay => gameState.type === "in-play";
    export const isPaused = (gameState: IGameState): gameState is IGameStatePaused => gameState.type === "paused";
    export const isEnded = (gameState: IGameState): gameState is IGameStateEnded => gameState.type === "ended";

    export const visit = <T = any>(gameState: IGameState, callbacks: IGameStateVisitor<T>) => {
        if (isNotStarted(gameState)) {
            return callbacks.notStarted(gameState);
        }

        if (isInPlay(gameState)) {
            return callbacks.inPlay(gameState);
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
