import * as React from "react";
import { IAllTeams } from "@stract/api";
import { Colors } from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./pieceSvg.module.scss";

type IPieceSize = "board" | "sidebar";

interface IOwnProps {
    squareDimension?: number;
    onClick?: () => void;
    team: keyof IAllTeams<any>;
    size: IPieceSize;
}

type IProps = IOwnProps;

function renderInsideSVG(
    element: React.ReactElement,
    options: { onClick?: () => void; squareDimension: number | undefined; size: IPieceSize },
) {
    const { onClick, squareDimension, size } = options;
    const dimension = size === "board" ? squareDimension ?? 100 : 25;

    return (
        <svg height={dimension} width={dimension} onClick={onClick} viewBox="0 0 100 100">
            {element}
        </svg>
    );
}

export function Circle(props: IProps) {
    const { onClick, squareDimension, size, team } = props;

    return renderInsideSVG(
        <circle
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            cx="50"
            cy="50"
            r="40"
            stroke={Colors.DARK_GRAY1}
            strokeWidth={10}
        />,
        { onClick, squareDimension, size },
    );
}

export function Square(props: IProps) {
    const { onClick, squareDimension, size, team } = props;

    return renderInsideSVG(
        <rect
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            x={10}
            y={10}
            width={80}
            height={80}
            stroke={Colors.DARK_GRAY1}
            strokeWidth={10}
            rx={5}
        />,
        { onClick, squareDimension, size },
    );
}

export function Triangle(props: IProps) {
    const { onClick, squareDimension, size, team } = props;
    return renderInsideSVG(
        <polygon
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            points="10,90 50,0 90,90"
            stroke={Colors.DARK_GRAY1}
            strokeWidth={10}
        />,
        { onClick, squareDimension, size },
    );
}

export function Plus(props: IProps) {
    const { onClick, squareDimension, size, team } = props;
    return renderInsideSVG(
        <g className={classNames({ [styles.northSpawn]: team === "north", [styles.southSpawn]: team === "south" })}>
            <rect height={8} width={40} x={30} y={46} rx={4} />
            <rect height={40} width={8} x={46} y={30} rx={4} />
        </g>,
        { onClick, squareDimension, size },
    );
}
