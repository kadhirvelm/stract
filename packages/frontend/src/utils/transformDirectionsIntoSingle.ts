import { IDirection } from "@stract/api";
import { IWaterDirections } from "./types";

export function transformDirectionsIntoSingleDirection(
    directions: [IDirection, IDirection] | [IDirection],
): IDirection | IWaterDirections {
    if (directions.length === 1) {
        return directions[0];
    }

    if (directions[0] === directions[1]) {
        return directions[0];
    }

    if (directions[0] === "north" || directions[0] === "south") {
        return `${directions[0]} ${directions[1]}` as IWaterDirections;
    }

    return `${directions[1]} ${directions[0]}` as IWaterDirections;
}
