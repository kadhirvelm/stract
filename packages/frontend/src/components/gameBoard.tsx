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
            board: {
                size: { columns, rows },
            },
        },
        board,
    } = gameBoard;

    const width = (window.innerWidth - MINIMUM_PADDING * 2) / columns;
    const height = (window.innerHeight - MINIMUM_PADDING * 2) / rows;

    const squareDimension = Math.min(width, height);

    return (
        <div className={styles.board}>
            {board.map((row, rowIndex) => (
                <div className={styles.row}>
                    {row.map((tile, columnIndex) => (
                        <GameTile
                            dimension={squareDimension}
                            gameTile={tile}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
