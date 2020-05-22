import { Spinner } from "@blueprintjs/core";
import { IStractGameV1 } from "@stract/api";
import { canAddAnyStagedActionToTile } from "@stract/utils";
import * as React from "react";
import { connect } from "react-redux";
import { flattenBoard } from "../../selectors/flattenBoard";
import { IStoreState } from "../../store";
import { getDimensions, getGameTileKey, IFlattenedBoard, IPlayerWithTeamKey } from "../../utils";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    flattenedBoard: IFlattenedBoard[];
    player?: IPlayerWithTeamKey;
}

type IProps = IStoreProps;

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
