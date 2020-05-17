import { IAllTeams, IBoardMetadata, IGameAction, IGamePieceType, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { sendServerMessage } from "../../socket";
import { ChangeSelectedTile, IStoreState } from "../../store";
import { getDimensions, IPlayerWithTeamKey, ISelectedTile, MARGIN_HORIZONTAL, MARGIN_VERTICAL } from "../../utils";
import { Circle, Square, Triangle } from "../pieces/pieceSvg";
import styles from "./addNewStagedAction.module.scss";

const VERTICAL_OFFSET = 10;

interface IStateProps {
    gameBoard: IStractGameV1 | undefined;
    player: IPlayerWithTeamKey | undefined;
    selectedTile: ISelectedTile | undefined;
}

interface IDispatchProps {
    removeSelectedTile: () => void;
}

type IProps = IStateProps & IDispatchProps;

const getTopAndLeft = (gameBoardMetadata: IBoardMetadata, selectedTile: ISelectedTile) => {
    const dimensions = getDimensions(gameBoardMetadata);

    const top =
        MARGIN_VERTICAL +
        dimensions.additionalGameBoardVerticalPadding +
        dimensions.squareDimension * selectedTile.rowIndex;
    const left =
        dimensions.sidebarWidth +
        MARGIN_HORIZONTAL +
        dimensions.additionalGameBoardHorizontalPadding +
        dimensions.squareDimension * selectedTile.columnIndex;

    const topOffset = selectedTile.rowIndex < 5 ? dimensions.squareDimension + VERTICAL_OFFSET : -VERTICAL_OFFSET;

    return {
        squareDimension: dimensions.squareDimension,
        top: top + topOffset,
        left,
    };
};

function SpawnOptions(props: {
    squareDimension: number;
    teamKey: keyof IAllTeams<any>;
    rowIndex: number;
    spawnTile: (pieceType: IGamePieceType) => () => void;
}) {
    const { teamKey, squareDimension, rowIndex, spawnTile } = props;

    return (
        <div
            className={styles.spawnNewTilesContainer}
            style={{ width: squareDimension, top: rowIndex > 4 ? "-20px" : "-5px" }}
        >
            <Circle team={teamKey} size="sidebar" onClick={spawnTile("circle")} />
            <Triangle team={teamKey} size="sidebar" onClick={spawnTile("triangle")} />
            <Square team={teamKey} size="sidebar" onClick={spawnTile("square")} />
        </div>
    );
}

function UnconnectedAddNewStagedAction(props: IProps) {
    const { gameBoard, player, removeSelectedTile, selectedTile } = props;
    if (gameBoard === undefined || player === undefined || selectedTile === undefined || player.teamKey === undefined) {
        return <div className={styles.addNewStagedAction} />;
    }

    const spawnTile = (pieceType: IGamePieceType) => () => {
        sendServerMessage().addStagedAction(
            IGameAction.spawnPiece({ startColumn: selectedTile.columnIndex, pieceType }),
        );
        removeSelectedTile();
    };

    const { top, squareDimension, left } = getTopAndLeft(gameBoard.metadata.board, selectedTile);

    return (
        <div className={styles.addNewStagedAction} style={{ top, left }}>
            <SpawnOptions
                squareDimension={squareDimension}
                teamKey={player.teamKey}
                spawnTile={spawnTile}
                rowIndex={selectedTile.rowIndex}
            />
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
        selectedTile: state.interface.selectedTile,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        removeSelectedTile: () => dispatch(ChangeSelectedTile.create(undefined)),
    };
}

export const AddNewStagedAction = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAddNewStagedAction);
