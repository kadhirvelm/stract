import { Spinner } from "@blueprintjs/core";
import { IStractGameV1, IGameTile } from "@stract/api";
import { canAddAnyStagedActionToTile } from "@stract/utils";
import { flatten } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { getDimensions, IPlayerWithTeamKey } from "../../utils";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";
import { flattenBoard } from "../../selectors/flattenBoard";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    flattenedBoard: Array<{ tile: IGameTile; columnIndex: number; rowIndex: number }>;
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
                    {flattenedBoard.map(({ tile, columnIndex, rowIndex }) => (
                        <GameTile
                            boardMetadata={metadata.board}
                            dimension={squareDimension}
                            canAddAnyStagedAction={canAddAnyStagedActionToTile(
                                player,
                                gameBoard,
                                rowIndex,
                                columnIndex,
                            )}
                            key={tile.occupiedBy[0]?.id ?? `${rowIndex}-${columnIndex}`}
                            gameTile={tile}
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
