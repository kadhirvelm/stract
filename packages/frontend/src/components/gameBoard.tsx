import * as React from "react";
import { IStractGame } from "@stract/api";
import { GameTile } from "./gameTile";
import styles from "./gameBoard.module.scss";

interface IProps {
    gameBoard: IStractGame;
}

const MINIMUM_PADDING = 10;

export function GameBoard(props: IProps) {
    const { gameBoard } = props;
    const {
        metadata: {
            boardSize: { x, y },
        },
        board,
    } = gameBoard;

    const width = (window.innerWidth - MINIMUM_PADDING * 2) / x;
    const height = (window.innerHeight - MINIMUM_PADDING * 2) / y;

    const squareDimension = Math.min(width, height);

    return (
        <div className={styles.board}>
            {board.map((row, xPos) => (
                <div className={styles.row}>
                    {row.map((tile, yPos) => (
                        <GameTile dimension={squareDimension} gameTile={tile} x={xPos} y={yPos} />
                    ))}
                </div>
            ))}
        </div>
    );
}
