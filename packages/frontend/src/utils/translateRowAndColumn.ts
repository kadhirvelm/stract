import { IRowIndex, IColumnIndex } from "@stract/api";

const charCodeForA = 65;

export function translateRow(rowIndex: IRowIndex) {
    return String.fromCharCode((rowIndex as number) + charCodeForA);
}

export function translateColumn(columnIndex: IColumnIndex) {
    return (columnIndex as number) + 1;
}

export function translateRowAndColumn(rowIndex: IRowIndex, columnIndex: IColumnIndex) {
    return `${translateRow(rowIndex)}, ${translateColumn(columnIndex)}`;
}
