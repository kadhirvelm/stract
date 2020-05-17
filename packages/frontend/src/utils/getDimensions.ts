import { IBoardMetadata } from "@stract/api";

const MARGIN_VERTICAL = 20;
const MARGIN_HORIZONTAL = 60;

const MINIMUM_SIDEBAR_WIDTH = 300;
const MAXIMUM_WIDTH = 500;

export function getDimensions(boardMetadata: IBoardMetadata) {
    const { columns, rows } = boardMetadata.size;

    const boardHeight = window.innerHeight - MARGIN_VERTICAL * 2;
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
