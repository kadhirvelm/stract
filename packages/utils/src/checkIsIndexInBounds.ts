import { IBoardMetadata } from "@stract/api";

export function checkIsIndexInBounds(columnIndex: number, rowIndex: number, gameBoardMetadata: IBoardMetadata) {
    if (columnIndex < 0 || columnIndex > gameBoardMetadata.size.columns) {
        return {
            isValid: false,
            message: `The column your action goes to, ${columnIndex}, is out of bounds. Please try again.`,
        };
    }

    if (rowIndex < 0 || rowIndex > gameBoardMetadata.size.rows) {
        return {
            isValid: false,
            message: `The row your action goes to, ${rowIndex}, is out of bounds. Please try again.`,
        };
    }

    return { isValid: true };
}
