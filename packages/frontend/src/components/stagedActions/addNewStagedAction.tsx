import {
    IAllTeams,
    IBoardMetadata,
    IDirection,
    IGameAction,
    IGamePiece,
    IGamePieceType,
    ISpecialActions,
    IStractGameV1,
} from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { sendServerMessage } from "../../socket";
import { ChangeSelectedTile, IStoreState } from "../../store";
import { getDimensions, IPlayerWithTeamKey, ISelectedTile, MARGIN_HORIZONTAL, MARGIN_VERTICAL } from "../../utils";
import { Arrow, Earth, Fire, IPieceSVGProps, Water } from "../pieces/pieceSvg";
import styles from "./addNewStagedAction.module.scss";

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

    return {
        squareDimension: dimensions.squareDimension,
        top,
        left,
    };
};

function SpawnOptions(props: {
    squareDimension: number;
    teamKey: keyof IAllTeams<any>;
    rowIndex: number;
    spawnTile: (pieceType: IGamePieceType) => () => void;
}) {
    const { teamKey, rowIndex, squareDimension, spawnTile } = props;

    const topOffset = rowIndex < 5 ? squareDimension : -25;

    return (
        <div className={styles.spawnNewTilesContainer} style={{ width: squareDimension, top: `${topOffset}px` }}>
            <Fire team={teamKey} size="sidebar" onClick={spawnTile("fire")} />
            <Water team={teamKey} size="sidebar" onClick={spawnTile("water")} />
            <Earth team={teamKey} size="sidebar" onClick={spawnTile("earth")} />
        </div>
    );
}

function MoveOptions(props: {
    gameSize: IBoardMetadata;
    selectedTile: ISelectedTile;
    squareDimension: number;
    teamKey: keyof IAllTeams<any>;
    moveTile: (direction: IDirection) => () => void;
}) {
    const { gameSize, moveTile, selectedTile, squareDimension, teamKey } = props;

    const isValidRow = (rowIndex: number) => rowIndex >= 0 && rowIndex < gameSize.size.rows;
    const isValidColumn = (columnIndex: number) => columnIndex >= 0 && columnIndex < gameSize.size.columns;

    const commonProps: IPieceSVGProps & { className: string } = {
        className: styles.direction,
        team: teamKey,
        size: "board",
        squareDimension,
    };

    return (
        <div>
            {isValidRow(selectedTile.rowIndex - 1) && (
                <Arrow
                    {...commonProps}
                    direction="north"
                    onClick={moveTile("north")}
                    style={{ top: `-${squareDimension}px` }}
                />
            )}
            {isValidColumn(selectedTile.columnIndex + 1) && (
                <Arrow
                    {...commonProps}
                    direction="east"
                    onClick={moveTile("east")}
                    style={{ left: `${squareDimension}px` }}
                />
            )}
            {isValidRow(selectedTile.rowIndex + 1) && (
                <Arrow
                    {...commonProps}
                    direction="south"
                    onClick={moveTile("south")}
                    style={{ top: `${squareDimension}px` }}
                />
            )}
            {isValidColumn(selectedTile.columnIndex - 1) && (
                <Arrow
                    {...commonProps}
                    direction="west"
                    onClick={moveTile("west")}
                    style={{ left: `-${squareDimension}px` }}
                />
            )}
        </div>
    );
}

function MaybeSpecialMoveOptions(props: {
    gameSize: IBoardMetadata;
    selectedTile: ISelectedTile;
    squareDimension: number;
    teamKey: keyof IAllTeams<any>;
    specialMoveTile: (directions: [IDirection, IDirection]) => () => void;
}) {
    const { gameSize, specialMoveTile, selectedTile, squareDimension, teamKey } = props;

    const isValidRow = (rowIndex: number) => rowIndex >= 0 && rowIndex < gameSize.size.rows;
    const isValidColumn = (columnIndex: number) => columnIndex >= 0 && columnIndex < gameSize.size.columns;
    const isValidIndex = (rowIndex: number, columnIndex: number) => isValidRow(rowIndex) && isValidColumn(columnIndex);

    const commonProps: IPieceSVGProps & { className: string } = {
        className: styles.direction,
        team: teamKey,
        size: "board",
        squareDimension,
    };

    const tile = selectedTile.gameTile.occupiedBy[0];
    if (IGamePiece.isEarth(tile)) {
        return null;
    }

    if (IGamePiece.isFire(tile)) {
        return (
            <div>
                {isValidRow(selectedTile.rowIndex - 2) && (
                    <Arrow
                        {...commonProps}
                        direction="north"
                        onClick={specialMoveTile(ISpecialActions.fire("north"))}
                        style={{ top: `-${squareDimension * 2}px` }}
                    />
                )}
                {isValidColumn(selectedTile.columnIndex + 2) && (
                    <Arrow
                        {...commonProps}
                        direction="east"
                        onClick={specialMoveTile(ISpecialActions.fire("east"))}
                        style={{ left: `${squareDimension * 2}px` }}
                    />
                )}
                {isValidRow(selectedTile.rowIndex + 2) && (
                    <Arrow
                        {...commonProps}
                        direction="south"
                        onClick={specialMoveTile(ISpecialActions.fire("south"))}
                        style={{ top: `${squareDimension * 2}px` }}
                    />
                )}
                {isValidColumn(selectedTile.columnIndex - 2) && (
                    <Arrow
                        {...commonProps}
                        direction="west"
                        onClick={specialMoveTile(ISpecialActions.fire("west"))}
                        style={{ left: `-${squareDimension * 2}px` }}
                    />
                )}
            </div>
        );
    }

    if (IGamePiece.isWater(tile)) {
        return (
            <div>
                {isValidIndex(selectedTile.rowIndex - 1, selectedTile.columnIndex + 1) && (
                    <Arrow
                        {...commonProps}
                        direction="north east"
                        onClick={specialMoveTile(ISpecialActions.water("north", "east"))}
                        style={{ top: `-${squareDimension}px`, left: `${squareDimension}px` }}
                    />
                )}
                {isValidIndex(selectedTile.rowIndex + 1, selectedTile.columnIndex + 1) && (
                    <Arrow
                        {...commonProps}
                        direction="south east"
                        onClick={specialMoveTile(ISpecialActions.water("south", "east"))}
                        style={{ top: `${squareDimension}px`, left: `${squareDimension}px` }}
                    />
                )}
                {isValidIndex(selectedTile.rowIndex + 1, selectedTile.columnIndex - 1) && (
                    <Arrow
                        {...commonProps}
                        direction="south west"
                        onClick={specialMoveTile(ISpecialActions.water("south", "west"))}
                        style={{ top: `${squareDimension}px`, left: `-${squareDimension}px` }}
                    />
                )}
                {isValidIndex(selectedTile.rowIndex - 1, selectedTile.columnIndex - 1) && (
                    <Arrow
                        {...commonProps}
                        direction="north west"
                        onClick={specialMoveTile(ISpecialActions.water("north", "west"))}
                        style={{ top: `-${squareDimension}px`, left: `-${squareDimension}px` }}
                    />
                )}
            </div>
        );
    }

    return null;
}

function UnconnectedAddNewStagedAction(props: IProps) {
    const { gameBoard, player, removeSelectedTile, selectedTile } = props;
    if (gameBoard === undefined || player === undefined || selectedTile === undefined || player.teamKey === undefined) {
        return <div className={styles.addNewStagedAction} />;
    }

    const spawnTile = (pieceType: IGamePieceType) => () => {
        sendServerMessage().addStagedAction(
            IGameAction.spawnPiece({ column: selectedTile.columnIndex, pieceType, row: selectedTile.rowIndex }),
        );
        removeSelectedTile();
    };

    const moveTile = (direction: IDirection) => () => {
        const id = selectedTile.gameTile.occupiedBy[0]?.id;
        if (id === undefined) {
            return;
        }

        sendServerMessage().addStagedAction(
            IGameAction.movePiece({
                gamePieceId: id,
                startRow: selectedTile.rowIndex,
                startColumn: selectedTile.columnIndex,
                direction,
            }),
        );
        removeSelectedTile();
    };

    const specialMoveTile = (directions: [IDirection, IDirection]) => () => {
        const id = selectedTile.gameTile.occupiedBy[0]?.id;
        if (id === undefined) {
            return;
        }

        sendServerMessage().addStagedAction(
            IGameAction.specialMove({
                gamePieceId: id,
                startRow: selectedTile.rowIndex,
                startColumn: selectedTile.columnIndex,
                directions,
            }),
        );
        removeSelectedTile();
    };

    const { top, squareDimension, left } = getTopAndLeft(gameBoard.metadata.board, selectedTile);
    const canMove = selectedTile.gameTile.occupiedBy.length > 0;

    return (
        <div className={styles.addNewStagedAction} style={{ top, left }}>
            {canMove && (
                <MoveOptions
                    gameSize={gameBoard.metadata.board}
                    selectedTile={selectedTile}
                    moveTile={moveTile}
                    squareDimension={squareDimension}
                    teamKey={player.teamKey}
                />
            )}
            {canMove && (
                <MaybeSpecialMoveOptions
                    gameSize={gameBoard.metadata.board}
                    selectedTile={selectedTile}
                    specialMoveTile={specialMoveTile}
                    squareDimension={squareDimension}
                    teamKey={player.teamKey}
                />
            )}
            {selectedTile.canSpawn && (
                <SpawnOptions
                    squareDimension={squareDimension}
                    teamKey={player.teamKey}
                    spawnTile={spawnTile}
                    rowIndex={selectedTile.rowIndex}
                />
            )}
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
