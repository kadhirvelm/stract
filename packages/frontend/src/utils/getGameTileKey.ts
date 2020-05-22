import { IOccupiedBy, IRowIndex, IColumnIndex } from "@stract/api";

export function getGameTileKey(occupiedBy: IOccupiedBy | undefined, rowIndex: IRowIndex, columnIndex: IColumnIndex) {
    return occupiedBy?.piece.id ?? `${rowIndex}-${columnIndex}`;
}
