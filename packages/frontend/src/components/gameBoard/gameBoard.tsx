import { Spinner } from "@blueprintjs/core";
import { IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { canAddAnyStagedActionToTile } from "@stract/utils";
import { IStoreState } from "../../store";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";
import { getDimensions, IPlayerWithTeamKey } from "../../utils";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    player?: IPlayerWithTeamKey;
}

type IProps = IStoreProps;

function UnconnectedGameBoard(props: IProps) {
    const { gameBoard, player } = props;
    if (gameBoard === undefined || player === undefined) {
        return <Spinner />;
    }

    const { metadata, board } = gameBoard;

    const { additionalGameBoardHorizontalPadding, additionalGameBoardVerticalPadding, squareDimension } = getDimensions(
        metadata.board,
    );

    const boardWidth = squareDimension * metadata.board.size.columns;

    return (
        <div className={styles.boardContainer}>
            <div
                className={styles.board}
                style={{
                    maxWidth: boardWidth,
                    top: additionalGameBoardVerticalPadding,
                    left: additionalGameBoardHorizontalPadding,
                }}
            >
                {board.map((row, rowIndex) => (
                    <div className={styles.row}>
                        {row.map((tile, columnIndex) => (
                            <GameTile
                                dimension={squareDimension}
                                canAddAnyStagedAction={canAddAnyStagedActionToTile(
                                    player,
                                    gameBoard,
                                    rowIndex,
                                    columnIndex,
                                )}
                                gameTile={tile}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
    };
}

export const GameBoard = connect(mapStateToProps)(UnconnectedGameBoard);