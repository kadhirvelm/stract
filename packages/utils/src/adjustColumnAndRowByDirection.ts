import { IDirection, IColumnIndex, IRowIndex, columnIndex, rowIndex } from "@stract/api";

interface IFinalMovement {
    column: IColumnIndex;
    row: IRowIndex;
}

export function adjustRowAndColumnByDirection(
    row: IRowIndex,
    column: IColumnIndex,
    direction: IDirection,
): IFinalMovement {
    switch (direction) {
        case "east":
            return { column: columnIndex(column + 1), row };
        case "north":
            return { column, row: rowIndex(row - 1) };
        case "south":
            return { column, row: rowIndex(row + 1) };
        case "west":
            return { column: columnIndex(column - 1), row };
        default:
            return { column, row };
    }
}

export function adjustRowAndColumnByMultipleDirections(
    row: IRowIndex,
    column: IColumnIndex,
    directions: IDirection[],
): IFinalMovement {
    let finalMovement: IFinalMovement = { column, row };

    directions.forEach(direction => {
        finalMovement = adjustRowAndColumnByDirection(finalMovement.row, finalMovement.column, direction);
    });

    return finalMovement;
}
