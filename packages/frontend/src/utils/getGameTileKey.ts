import { IOccupiedBy } from "@stract/api";

export function getGameTileKey(occupiedBy: IOccupiedBy | undefined, rowIndex: number, columnIndex: number) {
    return occupiedBy?.piece.id ?? `${rowIndex}-${columnIndex}`;
}
