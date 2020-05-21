import { IAllTeams, IDirection } from "@stract/api";
import classNames from "classnames";
import * as React from "react";
import styles from "./pieceSvg.module.scss";
import { IWaterDirections } from "../../utils";

type IPieceSize = "board" | "spawn" | "sidebar";

export interface IPieceSVGProps {
    squareDimension?: number;
    onClick?: () => void;
    team: keyof IAllTeams<any>;
    size: IPieceSize;
}

type IProps = IPieceSVGProps;

function getDimensionFromSize(size: IPieceSize) {
    if (size === "board") {
        return 0.9;
    }

    if (size === "spawn") {
        return 0.75;
    }

    return 0.35;
}

function renderInsideSVG(
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

export function Fire(props: IProps) {
    const { onClick, squareDimension, size, team } = props;

    return renderInsideSVG(
        <g
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            xmlns="http://www.w3.org/2000/svg"
            transform="translate(0,100) scale(0.1,-0.1)"
        >
            <path d="M603 940 c-133 -69 -234 -163 -257 -240 -9 -29 -16 -71 -16 -92 0 -46 -16 -49 -53 -10 -44 46 -58 93 -56 193 1 49 -2 93 -6 97 -12 12 -76 -69 -106 -133 -38 -83 -53 -213 -39 -348 18 -174 33 -214 117 -314 72 -85 97 -93 279 -93 146 0 158 1 205 25 148 75 232 224 209 366 -17 100 -23 124 -36 144 -22 35 -62 208 -67 292 -4 67 -2 86 14 112 10 17 23 31 29 31 5 0 10 5 10 10 0 6 -28 10 -64 10 -57 0 -75 -5 -163 -50z m-27 -491 c-14 -24 -17 -42 -12 -77 3 -25 10 -50 15 -56 15 -20 21 -80 11 -115 -13 -48 -51 -99 -80 -110 -100 -38 -157 -6 -176 97 -4 20 -9 41 -12 47 -18 30 22 130 61 154 16 11 18 8 15 -25 -2 -30 1 -38 20 -45 19 -7 24 -4 34 19 7 15 36 58 66 95 39 48 58 65 66 57 7 -7 5 -19 -8 -41z" />
        </g>,
        { onClick, squareDimension, size },
    );
}

export function Earth(props: IProps) {
    const { onClick, squareDimension, size, team } = props;

    return renderInsideSVG(
        <g
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            xmlns="http://www.w3.org/2000/svg"
            transform="translate(0,100) scale(0.1,-0.1)"
        >
            <path d="M248 994 c-4 -3 -2 -19 3 -36 7 -25 2 -42 -25 -97 -48 -94 -57 -136 -57 -261 0 -128 10 -166 59 -240 51 -76 111 -113 263 -161 162 -51 171 -58 177 -138 3 -41 9 -61 18 -61 20 0 25 32 15 104 -11 74 -9 83 58 263 41 112 47 166 26 239 -26 90 -58 137 -142 205 -95 76 -172 114 -264 129 -55 9 -73 17 -86 36 -15 23 -33 30 -45 18z m119 -170 c2 -44 43 -119 55 -102 4 7 8 28 8 46 0 17 5 32 11 32 8 0 10 -23 6 -77 -6 -74 -5 -81 27 -142 l33 -65 7 38 c4 21 5 50 2 64 -6 29 8 61 21 48 11 -10 7 -125 -5 -156 -7 -19 -3 -38 22 -90 17 -36 35 -71 40 -79 17 -27 30 22 34 132 3 73 8 107 16 104 19 -7 13 -189 -9 -236 -17 -40 -17 -41 4 -92 12 -28 20 -53 17 -56 -10 -10 -32 16 -51 57 -14 32 -23 40 -44 40 -34 0 -172 81 -201 117 -20 25 -20 28 -5 31 9 2 29 -7 43 -20 62 -55 172 -121 172 -103 0 3 -15 39 -34 79 -32 67 -39 75 -90 101 -59 30 -114 79 -98 89 5 3 33 -12 62 -34 30 -22 57 -40 61 -40 7 0 -20 64 -49 116 -6 12 -36 36 -67 53 -30 17 -55 36 -55 41 0 16 20 12 51 -11 25 -17 29 -18 29 -4 0 26 -39 93 -60 105 -11 6 -20 17 -20 26 0 11 4 12 19 5 15 -9 20 -7 24 11 8 30 21 15 24 -28z" />
        </g>,
        { onClick, squareDimension, size },
    );
}

export function Water(props: IProps) {
    const { onClick, squareDimension, size, team } = props;
    return renderInsideSVG(
        <g
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            xmlns="http://www.w3.org/2000/svg"
            transform="translate(0,100) scale(0.1,-0.1)"
        >
            <path d="M218 978 c-50 -11 -59 -23 -33 -42 26 -19 67 -144 55 -166 -5 -10 -10 -35 -10 -55 0 -20 -12 -87 -26 -148 -32 -139 -28 -212 17 -304 58 -121 168 -186 314 -186 89 -1 147 19 215 73 82 65 139 202 126 304 -18 141 -85 275 -191 382 -92 93 -139 119 -256 139 -94 17 -142 17 -211 3z m593 -424 c9 -11 14 -43 13 -93 0 -93 -19 -131 -110 -229 -82 -89 -142 -119 -184 -92 -12 8 4 29 86 108 98 93 133 141 139 186 14 116 19 136 30 136 7 0 19 -7 26 -16z" />
        </g>,
        { onClick, squareDimension, size },
    );
}

export function Spawn(props: IProps) {
    const { onClick, squareDimension, size, team } = props;
    return renderInsideSVG(
        <g
            className={classNames({ [styles.northSpawn]: team === "north", [styles.southSpawn]: team === "south" })}
            xmlns="http://www.w3.org/2000/svg"
            transform="translate(25,75) scale(0.05,-0.05)"
        >
            <path d="M393 881 c-75 -41 -175 -123 -207 -169 -115 -167 -89 -367 66 -506 87 -79 204 -107 344 -82 179 31 247 99 289 290 25 111 5 185 -67 252 -81 77 -219 107 -310 66 -132 -58 -217 -219 -157 -296 29 -37 70 -56 120 -56 102 0 189 57 189 124 0 58 -49 91 -104 70 -33 -13 -17 -33 25 -31 35 2 43 -2 50 -21 28 -75 -188 -134 -238 -66 -45 62 39 192 150 233 47 18 99 12 162 -18 136 -64 165 -168 91 -326 -50 -108 -121 -145 -281 -145 -78 0 -99 4 -143 26 -53 26 -104 79 -138 144 -14 26 -19 56 -19 120 0 80 2 89 40 160 26 49 69 105 122 161 106 110 109 121 16 70z" />
        </g>,
        { onClick, squareDimension, size },
    );
}

export function Arrow(
    props: IProps & {
        className: string;
        direction: IDirection | IWaterDirections;
        isSpecial?: boolean;
        style: React.CSSProperties;
    },
) {
    const { className, direction, isSpecial, onClick, squareDimension, size, style, team } = props;
    const transform = () => {
        switch (direction) {
            case "north":
                return "rotate(-90deg)";
            case "south":
                return "rotate(90deg)";
            case "west":
                return "rotate(180deg)";
            case "north west":
                return "rotate(-135deg)";
            case "north east":
                return "rotate(-45deg)";
            case "south east":
                return "rotate(45deg)";
            case "south west":
                return "rotate(135deg)";
            default:
                return "";
        }
    };

    return (
        <div className={className} style={style}>
            {renderInsideSVG(
                <g
                    className={classNames({
                        [styles.northMove]: team === "north" && !isSpecial,
                        [styles.northSpecial]: team === "north" && isSpecial,
                        [styles.southMove]: team === "south" && !isSpecial,
                        [styles.southSpecial]: team === "south" && isSpecial,
                    })}
                    style={{ transform: transform(), transformOrigin: "center" }}
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

export function SwitchArrows(props: Omit<IProps, "size"> & { className: string; style: React.CSSProperties }) {
    const { className, onClick, squareDimension, style, team } = props;
    if (squareDimension === undefined) {
        return null;
    }

    return (
        <div className={className} style={style}>
            <svg height={squareDimension * 0.25} width={squareDimension * 0.45} style={style} onClick={onClick}>
                <g
                    className={classNames({
                        [styles.northSpecial]: team === "north",
                        [styles.southSpecial]: team === "south",
                    })}
                    xmlns="http://www.w3.org/2000/svg"
                    transform="translate(0,75) scale(0.1,-0.1)"
                >
                    <path d="M88 702 c-27 -21 -48 -45 -48 -55 0 -20 -7 -20 315 4 136 11 178 21 141 35 -16 6 -144 2 -316 -11 l-75 -6 28 29 c52 55 24 57 -45 4z" />
                    <path d="M305 619 c-185 -12 -266 -22 -263 -34 4 -12 161 -13 298 -2 l95 8 -28 -29 c-28 -29 -34 -42 -18 -42 20 0 111 76 111 93 0 19 9 19 -195 6z" />
                </g>
            </svg>
        </div>
    );
}

export function HiddenPiece(props: IProps & { className?: string }) {
    const { className, onClick, squareDimension, size } = props;

    return (
        <div className={classNames(className, styles.basic)}>
            {renderInsideSVG(
                <rect className={styles.hidden} width={90} height={90} style={{ transform: "translate(5px, 5px)" }} />,
                {
                    onClick,
                    squareDimension,
                    size,
                },
            )}
        </div>
    );
}

export function Star(props: Pick<IProps, "squareDimension"> & { className: string }) {
    const { className, squareDimension } = props;

    return (
        <div className={classNames(className, styles.basic)}>
            {renderInsideSVG(
                <g
                    className={styles.star}
                    xmlns="http://www.w3.org/2000/svg"
                    transform="translate(3,75) scale(0.1,-0.1)"
                >
                    <path d="M738 723 c-3 -4 -11 -28 -18 -53 -20 -67 -24 -70 -102 -70 -55 0 -70 -3 -75 -17 -6 -16 6 -29 77 -84 l33 -25 -16 -49 c-20 -56 -22 -91 -6 -101 6 -3 34 10 63 30 29 20 58 36 65 36 7 0 33 -16 58 -35 52 -40 56 -41 77 -20 13 14 13 21 -5 72 -10 31 -19 61 -19 67 0 6 23 26 50 45 38 26 50 40 48 55 -3 18 -12 22 -73 26 l-70 5 -21 60 c-16 44 -27 61 -42 63 -11 2 -22 0 -24 -5z" />
                </g>,
                { squareDimension, size: "board" },
            )}
        </div>
    );
}

export function Cross(props: Pick<IProps, "squareDimension"> & { className: string; style: React.CSSProperties }) {
    const { className, squareDimension, style } = props;

    return (
        <div className={classNames(className, styles.basic)} style={style}>
            {renderInsideSVG(
                <g
                    className={styles.cross}
                    xmlns="http://www.w3.org/2000/svg"
                    transform="translate(0,75) scale(0.1,-0.1)"
                >
                    <path d="M16 713 c-5 -12 15 -39 74 -98 44 -44 80 -85 80 -90 0 -5 -37 -47 -82 -92 -70 -70 -80 -84 -68 -97 7 -9 17 -16 24 -16 6 0 48 37 93 82 l82 82 80 -83 c53 -55 86 -82 98 -79 39 7 25 39 -55 121 l-80 82 79 83 c80 82 94 113 56 120 -12 3 -46 -24 -100 -78 l-81 -81 -81 81 c-81 80 -107 94 -119 63z" />
                </g>,
                { squareDimension, size: "board" },
            )}
        </div>
    );
}
