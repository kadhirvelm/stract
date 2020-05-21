import { createSelector } from "reselect";
import { IGameTile } from "@stract/api";
import { flatten } from "lodash-es";
import { IStoreState } from "../store";
import { IFlattenedBoard } from "../utils";

/**
 * In order to get the CSS transitions to work reliably, we need to paint them at the same time, not row by row, and
 * we need to paint the tiles with tokens in the same order to ensure tokens moving south work. I'm not entirely certain why
 * the sort is what fixes that, but it does?
 */
export const flattenBoard = createSelector(
    (state: IStoreState) => state.game.gameBoard?.board,
    (board: IGameTile[][] | undefined): IFlattenedBoard[] => {
        if (board === undefined) {
            return [];
        }

        const flattenedArray: IFlattenedBoard[] = flatten(
            board.map((row, rowIndex) =>
                flatten(
                    row.map((tile, columnIndex): IFlattenedBoard[] => {
                        if (tile.occupiedBy.length === 0) {
                            return [{ occupiedBy: undefined, parentTile: tile, rowIndex, columnIndex }];
                        }
                        return tile.occupiedBy.map(ob => ({ parentTile: tile, rowIndex, columnIndex, occupiedBy: ob }));
                    }),
                ),
            ),
        );

        return flattenedArray.sort((a, b) => {
            const idA = a.occupiedBy?.piece.id;
            const idB = b.occupiedBy?.piece.id;

            if (idA === idB || (idA === undefined && idB === undefined)) {
                return 0;
            }

            if (idA === undefined && idB !== undefined) {
                return -1;
            }

            if (idA !== undefined && idB === undefined) {
                return 1;
            }

            if (idA === undefined || idB === undefined) {
                throw new Error(
                    `Something went wrong when comparing two IDs to sort in flattened board: ${JSON.stringify(
                        a,
                    )}, ${JSON.stringify(b)}`,
                );
            }

            return idA.localeCompare(idB);
        });
    },
);
