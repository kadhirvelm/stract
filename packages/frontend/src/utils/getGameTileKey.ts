import { IOccupiedBy, IRowIndex, IColumnIndex, IGameState } from "@stract/api";

export function getGameTileKey(
    occupiedBy: IOccupiedBy | undefined,
    rowIndex: IRowIndex,
    columnIndex: IColumnIndex,
    gameState?: IGameState,
) {
    const maybeGameState = () => {
        if (gameState === undefined) {
            return undefined;
        }

        return IGameState.isInPlay(gameState) || IGameState.isRequestPause(gameState) ? "-ready" : "-not-ready";
    };

    return occupiedBy?.piece.id ?? `${rowIndex}-${columnIndex}${maybeGameState()}`;
}
