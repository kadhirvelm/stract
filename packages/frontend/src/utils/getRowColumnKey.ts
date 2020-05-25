import { IRowIndex, IColumnIndex } from "@stract/api";

export function getRowColumnKey(rowIndex: IRowIndex, columnIndex: IColumnIndex) {
    return `${rowIndex}_${columnIndex}`;
}
