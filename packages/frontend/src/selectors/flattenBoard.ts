import { createSelector } from "reselect";
import { IGameTile } from "@stract/api";
import { flatten } from "lodash-es";
import { IStoreState } from "../store";

/**
 * In order to get the CSS transitions to work reliably, we need to paint them at the same time, not row by row, and
 * we need to paint the tiles with tokens on them first to ensure tokens moving south work. I'm not entirely certain why
 * the sort is what fixes that, but it does?
 */
export const flattenBoard = createSelector(
    (state: IStoreState) => state.game.gameBoard?.board,
    (board: IGameTile[][] | undefined) => {
        if (board === undefined) {
            return [];
        }

        const flattenedArray = flatten(
            board.map((row, rowIndex) => row.map((tile, columnIndex) => ({ tile, rowIndex, columnIndex }))),
        );

        return flattenedArray.sort((a, b) => {
            if (a.tile.occupiedBy.length === b.tile.occupiedBy.length) {
                return 0;
            }

            return a.tile.occupiedBy.length > b.tile.occupiedBy.length ? 1 : -1;
        });
    },
);
