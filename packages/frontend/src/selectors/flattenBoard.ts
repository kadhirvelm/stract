import { createSelector } from "reselect";
import { IGameTile } from "@stract/api";
import { flatten } from "lodash-es";
import { IStoreState } from "../store";

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
