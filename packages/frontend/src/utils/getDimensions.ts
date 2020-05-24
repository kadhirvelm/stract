import { IBoardMetadata } from "@stract/api";

export const MARGIN_VERTICAL_TOP = 40;
export const MARGIN_VERTICAL_BOTTOM = 20;
export const MARGIN_HORIZONTAL = 60;

export const MINIMUM_SIDEBAR_WIDTH = 300;
export const MAXIMUM_WIDTH = 500;

export function getDimensions(boardMetadata: IBoardMetadata) {
    const { columns, rows } = boardMetadata.size;

    const boardHeight = window.innerHeight - (MARGIN_VERTICAL_TOP + MARGIN_VERTICAL_BOTTOM);
    const boardWidth = window.innerWidth - MARGIN_HORIZONTAL * 2;

    const squareDimension = Math.min(boardHeight / rows, (boardWidth - MINIMUM_SIDEBAR_WIDTH) / columns);

    const sidebarWidth = Math.min(
        Math.max(
            Math.max(window.innerHeight, window.innerWidth) -
                Math.min(window.innerHeight, window.innerWidth) -
                MARGIN_HORIZONTAL,
            MINIMUM_SIDEBAR_WIDTH,
        ),
        MAXIMUM_WIDTH,
    );

    const additionalGameBoardHorizontalPadding = (boardWidth - columns * squareDimension - sidebarWidth) / 2;
    const additionalGameBoardVerticalPadding = (boardHeight - rows * squareDimension) / 2;

    return {
        additionalGameBoardHorizontalPadding,
        additionalGameBoardVerticalPadding,
        sidebarWidth,
        squareDimension,
    };
}
