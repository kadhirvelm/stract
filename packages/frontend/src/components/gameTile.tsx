import * as React from "react";
import { IStractGameTile } from "@stract/api";
import classNames from "classnames";
import styles from "./gameTile.module.scss";

interface IProps {
    dimension: number;
    gameTile: IStractGameTile;
    x: number;
    y: number;
}

export function GameTile(props: IProps) {
    const { dimension, gameTile, x } = props;
    if (gameTile.type === "free") {
        return (
            <div
                className={classNames(styles.freeTile, { [styles.northTile]: x < 5, [styles.southTile]: x >= 5 })}
                style={{ height: dimension, width: dimension }}
            />
        );
    }

    return null;
}
