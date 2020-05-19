import { Spinner } from "@blueprintjs/core";
import { IStractGameV1 } from "@stract/api";
import { canAddAnyStagedActionToTile } from "@stract/utils";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { getDimensions, IPlayerWithTeamKey } from "../../utils";
import styles from "./gameBoard.module.scss";
import { GameTile } from "./gameTile";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    player?: IPlayerWithTeamKey;
}

type IProps = IStoreProps;

class UnconnectedGameBoard extends React.PureComponent<IProps> {
    public render() {
        const { gameBoard, player } = this.props;
        if (gameBoard === undefined || player === undefined) {
            return <Spinner />;
        }

        const { metadata, board } = gameBoard;

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
                    {board.map((row, rowIndex) => {
                        return row.map((tile, columnIndex) => (
                            <GameTile
                                boardMetadata={metadata.board}
                                dimension={squareDimension}
                                canAddAnyStagedAction={canAddAnyStagedActionToTile(
                                    player,
                                    gameBoard,
                                    rowIndex,
                                    columnIndex,
                                )}
                                key={tile.occupiedBy?.[0]?.id}
                                gameTile={tile}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                            />
                        ));
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
    };
}

export const GameBoard = connect(mapStateToProps)(UnconnectedGameBoard);
