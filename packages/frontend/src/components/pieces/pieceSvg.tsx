import { IAllTeams, IDirection } from "@stract/api";
import classNames from "classnames";
import * as React from "react";
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

export function Fire(props: IProps) {
    const { onClick, squareDimension, size, team } = props;

    return renderInsideSVG(
        <g
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            xmlns="http://www.w3.org/2000/svg"
            transform="translate(0,100) scale(0.1,-0.1)"
        >
            <path d="M795 936 c-22 -7 -56 -21 -75 -31 -30 -16 -33 -16 -21 -2 12 15 11 17 -3 17 -25 0 -150 -124 -195 -194 -40 -62 -81 -154 -81 -186 0 -8 -5 -22 -10 -30 -20 -32 -133 129 -165 234 l-12 39 -20 -34 c-34 -54 -62 -150 -75 -253 -16 -126 -2 -213 49 -315 31 -62 46 -80 80 -99 109 -60 273 -79 382 -45 68 22 114 65 160 152 l34 65 0 140 c0 118 -4 158 -27 249 -33 139 -33 170 4 243 16 32 30 60 30 62 0 4 -14 1 -55 -12z m-53 -78 c-16 -16 -16 -59 1 -53 8 4 13 -6 14 -27 0 -18 10 -76 22 -128 30 -139 39 -329 17 -403 -18 -62 -68 -127 -118 -153 -29 -15 -29 -15 -18 7 15 28 16 155 1 192 -6 16 -11 45 -11 65 0 47 26 146 40 150 24 8 8 24 -17 17 -94 -23 -221 -131 -245 -207 l-11 -37 -43 41 c-38 36 -64 47 -56 24 2 -5 4 -39 6 -75 3 -71 32 -149 69 -189 l22 -24 -55 21 c-37 14 -70 38 -101 70 -42 44 -47 55 -52 112 -15 137 1 399 23 399 4 0 11 -16 14 -36 5 -23 12 -34 20 -31 8 3 22 -10 35 -33 28 -50 86 -100 115 -100 20 0 25 8 40 67 9 36 27 91 41 122 26 55 111 154 150 172 11 5 38 21 60 34 39 24 59 25 37 3z m-108 -393 c-18 -27 -17 -55 6 -213 11 -72 10 -89 -4 -125 -15 -39 -20 -43 -69 -55 -72 -17 -94 -15 -127 8 -31 22 -66 96 -76 161 -7 43 -6 43 12 27 10 -9 31 -20 47 -23 22 -6 26 -4 21 8 -14 39 71 151 160 211 48 32 51 32 30 1z" />
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
            <path d="M615 867 c-88 -33 -299 -129 -316 -144 -24 -20 -39 -90 -39 -176 l0 -74 -49 -23 c-27 -12 -53 -32 -59 -44 -15 -33 -32 -159 -32 -241 0 -73 -1 -75 -24 -75 -30 0 -44 -19 -25 -31 19 -12 858 -10 881 2 22 12 24 39 3 39 -13 0 -15 25 -15 163 -1 89 -5 195 -9 236 -8 66 -13 77 -47 112 -20 21 -49 41 -64 44 -22 5 -34 23 -73 105 -26 55 -47 104 -47 109 0 17 -36 17 -85 -2z m65 -38 c0 -22 54 -124 71 -134 17 -11 9 -25 -15 -25 -14 0 -27 -4 -30 -9 -7 -10 17 -21 46 -21 33 0 125 -67 142 -105 14 -28 16 -67 14 -235 l-3 -202 -46 -2 -47 -2 -7 81 c-10 120 -68 227 -129 240 -86 17 -114 14 -154 -13 -81 -55 -192 -172 -162 -172 6 0 10 -28 10 -70 l0 -70 -105 0 -105 0 0 33 c1 86 21 239 34 265 15 30 72 62 173 98 49 17 53 17 65 2 12 -16 40 -19 53 -6 3 3 -1 11 -10 18 -8 7 -15 19 -15 26 0 8 -6 14 -13 14 -12 0 -92 -26 -139 -45 -16 -6 -18 -1 -17 41 1 100 12 135 49 165 19 16 80 44 135 64 55 19 120 46 145 60 56 30 60 30 60 4z m32 -483 c31 -36 59 -116 68 -199 l6 -57 -195 0 -194 0 6 77 6 76 71 72 72 73 67 -6 c58 -4 69 -8 93 -36z" />
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
            <path d="M395 957 c10 -50 -8 -101 -71 -207 -109 -183 -148 -295 -149 -425 0 -103 19 -157 76 -214 80 -80 233 -119 344 -86 72 21 141 90 193 194 32 65 37 84 36 140 -1 126 -43 217 -184 397 -152 196 -188 234 -221 234 -29 0 -30 -2 -24 -33z m180 -195 c140 -175 187 -257 205 -360 10 -61 9 -74 -8 -120 -46 -120 -117 -202 -194 -222 -54 -15 -158 -5 -218 21 -175 77 -202 281 -69 526 109 203 139 266 139 295 0 16 4 27 10 23 5 -3 66 -76 135 -163z" />
            <path d="M720 346 c0 -40 -47 -122 -92 -160 -23 -20 -45 -36 -50 -36 -4 0 -8 -7 -8 -15 0 -19 13 -19 49 -1 85 44 179 236 115 236 -8 0 -14 -10 -14 -24z" />
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

export function Arrow(props: IProps & { className: string; direction: IDirection; style: React.CSSProperties }) {
    const { className, direction, onClick, squareDimension, size, style, team } = props;
    const transform = () => {
        switch (direction) {
            case "north":
                return "rotate(-90deg) translate(-100px, 0)";
            case "south":
                return "rotate(90deg) translate(0, -100px)";
            case "west":
                return "rotate(180deg) translate(-100px, -100px)";
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
