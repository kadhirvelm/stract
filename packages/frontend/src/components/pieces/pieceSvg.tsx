import * as React from "react";
import { IAllTeams, IDirection } from "@stract/api";
import { Colors } from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./pieceSvg.module.scss";

type IPieceSize = "board" | "sidebar";

export interface IPieceSVGProps {
    squareDimension?: number;
    onClick?: () => void;
    team: keyof IAllTeams<any>;
    size: IPieceSize;
}

type IProps = IPieceSVGProps;

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
            strokeWidth={2}
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
            strokeWidth={2}
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
            strokeWidth={2}
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

export function Arrow(props: IProps & { className: string; direction: IDirection; style: React.CSSProperties }) {
    const { className, direction, onClick, squareDimension, size, style, team } = props;
    const transform = () => {
        switch (direction) {
            case "north":
                return `rotate(-90deg) translate(-${squareDimension}px, 0)`;
            case "south":
                return `rotate(90deg) translate(0, -${squareDimension}px)`;
            case "west":
                return `rotate(180deg) translate(-${squareDimension}px, -${squareDimension}px)`;
            default:
                return "";
        }
    };

    return (
        <div className={className} style={style}>
            {renderInsideSVG(
                <g
                    className={classNames({
                        [styles.northLine]: team === "north",
                        [styles.southLine]: team === "south",
                    })}
                    style={{ transform: transform() }}
                >
                    <line x1="15" y1="50" x2="85" y2="50" strokeWidth={8} strokeLinecap="round" />
                    <line x1="60" y1="25" x2="85" y2="50" strokeWidth={8} strokeLinecap="round" />
                    <line x1="60" y1="75" x2="85" y2="50" strokeWidth={8} strokeLinecap="round" />
                </g>,
                { onClick, squareDimension, size },
            )}
        </div>
    );
}

export function HiddenPiece(props: IProps) {
    const { onClick, squareDimension, size } = props;

    return renderInsideSVG(<rect className={styles.hidden} width={100} height={100} />, {
        onClick,
        squareDimension,
        size,
    });
}
