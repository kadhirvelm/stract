import { IDirection } from "@stract/api";

export function adjustColumnAndRowByDirection(column: number, row: number, direction: IDirection) {
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
