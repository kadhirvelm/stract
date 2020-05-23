import { columnIndex, IGameTile, rowIndex } from "@stract/api";
import { flatten, isEqual } from "lodash-es";
import { createSelectorCreator, defaultMemoize } from "reselect";
import { IStoreState } from "../store";
import { IFlattenedBoard, maybePlaySoundsForTile } from "../utils";

const createDeepSelectorCreator = createSelectorCreator(defaultMemoize, isEqual);

/**
 * In order to get the CSS transitions to work reliably, we need to paint them at the same time, not row by row, and
 * we need to paint the tiles with tokens in the same order to ensure tokens moving south work. I'm not entirely certain why
 * the sort is what fixes that, but it does?
 */
export const flattenBoard = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.board,
    (board: IGameTile[][] | undefined): IFlattenedBoard[] => {
        if (board === undefined) {
            return [];
        }

        const flattenedArray: IFlattenedBoard[] = flatten(
            board.map((row, rowNumber) =>
                flatten(
                    row.map((tile, columnNumber): IFlattenedBoard[] => {
                        const allOccupiedTiles: IFlattenedBoard[] = [
                            {
                                occupiedBy: undefined,
                                parentTile: tile,
                                rowIndex: rowIndex(rowNumber),
                                columnIndex: columnIndex(columnNumber),
                            },
                        ];

                        allOccupiedTiles.push(
                            ...tile.occupiedBy.map(ob => {
                                maybePlaySoundsForTile(ob);
                                return {
                                    parentTile: tile,
                                    rowIndex: rowIndex(rowNumber),
                                    columnIndex: columnIndex(columnNumber),
                                    occupiedBy: ob,
                                };
                            }),
                        );

                        return allOccupiedTiles;
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
