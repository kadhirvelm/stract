import { IDirection } from "@stract/api";

interface IFinalMovement {
    column: number;
    row: number;
}

export function adjustColumnAndRowByDirection(column: number, row: number, direction: IDirection): IFinalMovement {
    switch (direction) {
        case "east":
            return { column: column + 1, row };
        case "north":
            return { column, row: row - 1 };
        case "south":
            return { column, row: row + 1 };
        case "west":
            return { column: column - 1, row };
        default:
            return { column, row };
    }
}

export function adjustColumnAndRowByMultipleDirections(
    column: number,
    row: number,
    directions: IDirection[],
): IFinalMovement {
    let finalMovement: IFinalMovement = { column, row };

    directions.forEach(direction => {
        finalMovement = adjustColumnAndRowByDirection(finalMovement.column, finalMovement.row, direction);
    });

    return finalMovement;
}
