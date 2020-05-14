import { Spinner } from "@blueprintjs/core";
import { IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../store";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";

interface IStoreProps {
    gameBoard?: IStractGameV1;
}

type IProps = IStoreProps;

const MINIMUM_PADDING = 10;

function UnconnectedGameBoard(props: IProps) {
    const { gameBoard } = props;
    if (gameBoard === undefined) {
        return <Spinner />;
    }

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

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
    };
}

export const GameBoard = connect(mapStateToProps)(UnconnectedGameBoard);
