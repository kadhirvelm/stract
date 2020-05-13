import * as React from "react";
import { IGameTile, IGameAction } from "@stract/api";
import classNames from "classnames";
import styles from "./gameTile.module.scss";
import { sendServerMessage } from "../socket";

interface IProps {
    dimension: number;
    gameTile: IGameTile;
    rowIndex: number;
    columnIndex: number;
}

export function GameTile(props: IProps) {
    const { columnIndex, dimension, gameTile, rowIndex } = props;

    const addTileTest = () =>
        sendServerMessage().addStagedAction(
            IGameAction.spawnPiece({
                startColumn: columnIndex,
                pieceType: "circle",
            }),
        );

    if (gameTile.type === "free") {
        return (
            <div
                className={classNames(styles.freeTile, {
                    [styles.northTile]: rowIndex < 5,
                    [styles.southTile]: rowIndex >= 5,
                })}
                onClick={addTileTest}
                style={{ height: dimension, width: dimension }}
            />
        );
    }

    return null;
}
