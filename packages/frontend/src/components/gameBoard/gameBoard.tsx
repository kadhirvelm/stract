import { Spinner } from "@blueprintjs/core";
import { IStractGameV1, IColumnIndex, IRowIndex } from "@stract/api";
import { canAddAnyStagedActionToTile } from "@stract/utils";
import * as React from "react";
import { connect } from "react-redux";
import { flattenBoard } from "../../selectors/flattenBoard";
import { IStoreState } from "../../store";
import {
    getDimensions,
    getGameTileKey,
    IFlattenedBoard,
    IPlayerWithTeamKey,
    translateRow,
    translateColumn,
} from "../../utils";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    flattenedBoard: IFlattenedBoard[];
    player?: IPlayerWithTeamKey;
}

type IProps = IStoreProps;

function MaybeRenderRowLabel(props: {
    columnIndex: IColumnIndex;
    rowIndex: IRowIndex;
    squareDimension: number;
}): React.ReactElement | null {
    const { columnIndex, rowIndex, squareDimension } = props;

    if (columnIndex !== 0) {
        return null;
    }

    return (
        <span
            className={styles.rowLabel}
            style={{
                top: `${squareDimension * rowIndex + squareDimension / 2}px`,
            }}
        >
            {translateRow(rowIndex)}
        </span>
    );
}

function MaybeRenderColumnLabel(props: {
    columnIndex: IColumnIndex;
    rowIndex: IRowIndex;
    squareDimension: number;
}): React.ReactElement | null {
    const { columnIndex, rowIndex, squareDimension } = props;

    if (rowIndex !== 0) {
        return null;
    }

    return (
        <span
            className={styles.columnLabel}
            style={{
                left: `${squareDimension * columnIndex + squareDimension / 2}px`,
            }}
        >
            {translateColumn(columnIndex)}
        </span>
    );
}

class UnconnectedGameBoard extends React.PureComponent<IProps> {
    public render() {
        const { gameBoard, flattenedBoard, player } = this.props;
        if (gameBoard === undefined || player === undefined) {
            return <Spinner />;
        }

        const { metadata } = gameBoard;

        const {
            additionalGameBoardHorizontalPadding,
            additionalGameBoardVerticalPadding,
            squareDimension,
        } = getDimensions(metadata.board);

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
                    {flattenedBoard.map(({ occupiedBy, rowIndex, columnIndex }) => (
                        <>
                            <MaybeRenderRowLabel
                                columnIndex={columnIndex}
                                rowIndex={rowIndex}
                                squareDimension={squareDimension}
                            />
                            <MaybeRenderColumnLabel
                                columnIndex={columnIndex}
                                rowIndex={rowIndex}
                                squareDimension={squareDimension}
                            />
                            <GameTile
                                totalBoardRows={metadata.board.size.rows}
                                dimension={squareDimension}
                                canAddAnyStagedAction={canAddAnyStagedActionToTile(
                                    player,
                                    gameBoard,
                                    rowIndex,
                                    columnIndex,
                                )}
                                key={getGameTileKey(occupiedBy, rowIndex, columnIndex)}
                                occupiedBy={occupiedBy}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                            />
                        </>
                    ))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        flattenedBoard: flattenBoard(state),
        player: state.game.player,
    };
}

export const GameBoard = connect(mapStateToProps)(UnconnectedGameBoard);
