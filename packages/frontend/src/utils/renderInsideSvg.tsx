import * as React from "react";
import { IPieceSize } from "./types";

function getDimensionFromSize(size: IPieceSize) {
    if (size === "board") {
        return 0.9;
    }

    if (size === "spawn") {
        return 0.75;
    }

    return 0.25;
}

export function renderInsideSVG(
    element: React.ReactElement,
    options: { onClick?: () => void; squareDimension: number | undefined; size: IPieceSize },
) {
    const { onClick, squareDimension, size } = options;
    const dimension = getDimensionFromSize(size) * (squareDimension ?? 100);

    return (
        <svg height={dimension} width={dimension} onClick={onClick} viewBox="0 0 100 100">
            {element}
        </svg>
    );
}
