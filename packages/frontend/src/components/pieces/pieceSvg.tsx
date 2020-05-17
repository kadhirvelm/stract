import * as React from "react";
import { IAllTeams } from "@stract/api";
import { Colors } from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./pieceSvg.module.scss";

function renderInsideSVG(element: React.ReactElement) {
    return (
        <svg height="25" width="25" viewBox="0 0 100 100">
            {element}
        </svg>
    );
}

interface IOwnProps {
    team: keyof IAllTeams<any>;
}

type IProps = IOwnProps;

export function Circle(props: IOwnProps) {
    const { team } = props;

    return renderInsideSVG(
        <circle
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            cx="50"
            cy="50"
            r="40"
            stroke={Colors.DARK_GRAY1}
            strokeWidth={10}
        />,
    );
}

export function Square(props: IOwnProps) {
    const { team } = props;

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
    );
}

export function Triangle(props: IOwnProps) {
    const { team } = props;
    return renderInsideSVG(
        <polygon
            className={classNames({ [styles.north]: team === "north", [styles.south]: team === "south" })}
            points="10,90 50,0 90,90"
            stroke={Colors.DARK_GRAY1}
            strokeWidth={10}
        />,
    );
}
