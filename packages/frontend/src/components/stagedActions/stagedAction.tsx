import { Button } from "@blueprintjs/core";
import { IBoardTeamMetadata, IGameAction, IGameActionId, IPlayerIdentifier, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { adjustRowAndColumnByMultipleDirections } from "@stract/utils";
import { sendServerMessage } from "../../socket";
import { IStoreState } from "../../store";
import { IPlayerWithTeamKey, transformDirectionsIntoSingleDirection, translateRowAndColumn } from "../../utils";
import { Arrow, Spawn, SwitchArrows, BoardPiece } from "../pieces";
import styles from "./stagedAction.module.scss";

interface IOwnProps {
    stagedAction: IGameAction;
}

interface IStateProps {
    gameBoard: IStractGameV1 | undefined;
    player?: IPlayerWithTeamKey;
}

type IProps = IOwnProps & IStateProps;

function Action(props: {
    action: IGameAction;
    actionDescription: React.ReactElement;
    actionImage: React.ReactElement;
    addedByPlayer: IPlayerIdentifier | undefined;
    currentPlayer: IPlayerWithTeamKey;
    teamMetadata: IBoardTeamMetadata;
}) {
    const { actionDescription, actionImage, addedByPlayer, currentPlayer, teamMetadata, action } = props;
    if (currentPlayer === undefined || currentPlayer.teamKey === undefined || addedByPlayer === undefined) {
        return null;
    }

    const playerName =
        addedByPlayer === currentPlayer.id ? "You" : teamMetadata.players.find(p => p.id === addedByPlayer)?.name;

    const maybeRenderDeleteButton = () => {
        if (action.addedByPlayer !== currentPlayer.id) {
            return null;
        }

        const removeAction = (actionId: IGameActionId) => () =>
            sendServerMessage().removeStagedAction({ id: actionId, player: currentPlayer.id });

        return (
            <div className={styles.buttonContainer}>
                <Button icon="cross" intent="danger" minimal onClick={removeAction(action.id)} />
            </div>
        );
    };

    return (
        <div className={styles.stagedContainer}>
            {actionImage}
            <div className={styles.stagedContainerInfo}>
                {actionDescription}
                <span className={styles.playerName}>{playerName}</span>
            </div>
            {maybeRenderDeleteButton()}
        </div>
    );
}

function UnconnectedStagedAction(props: IProps) {
    const { gameBoard, player, stagedAction } = props;
    if (gameBoard === undefined || player === undefined || player.teamKey == null) {
        return null;
    }

    const commonProps = {
        currentPlayer: player,
        teamMetadata: gameBoard.teams[player.teamKey],
    };

    const SQUARE_DIMENSION = 100;

    return IGameAction.visit(stagedAction, {
        movePiece: move => (
            <Action
                action={move}
                actionDescription={
                    <div>
                        Move {translateRowAndColumn(move.movePiece.start.row, move.movePiece.start.column)}{" "}
                        {move.movePiece.direction}
                    </div>
                }
                actionImage={
                    <Arrow
                        team={player.teamKey}
                        direction={move.movePiece.direction}
                        size="board"
                        squareDimension={SQUARE_DIMENSION}
                    />
                }
                addedByPlayer={move.addedByPlayer}
                {...commonProps}
            />
        ),
        spawnPiece: spawn => (
            <Action
                action={spawn}
                actionDescription={
                    <div>
                        Spawn <BoardPiece piece={spawn.spawnPiece.pieceType} team={player.teamKey} /> at{" "}
                        {translateRowAndColumn(spawn.spawnPiece.row, spawn.spawnPiece.column)}
                    </div>
                }
                actionImage={<Spawn team={player.teamKey} size="board" squareDimension={SQUARE_DIMENSION} />}
                addedByPlayer={spawn.addedByPlayer}
                {...commonProps}
            />
        ),
        specialMovePiece: specialMove => {
            const adjustedRowAndColumn = adjustRowAndColumnByMultipleDirections(
                specialMove.specialMove.start.row,
                specialMove.specialMove.start.column,
                specialMove.specialMove.directions,
            );

            return (
                <Action
                    action={specialMove}
                    actionDescription={
                        <div>
                            Special move{" "}
                            {translateRowAndColumn(
                                specialMove.specialMove.start.row,
                                specialMove.specialMove.start.column,
                            )}{" "}
                            {transformDirectionsIntoSingleDirection(specialMove.specialMove.directions)} to{" "}
                            {translateRowAndColumn(adjustedRowAndColumn.row, adjustedRowAndColumn.column)}
                        </div>
                    }
                    actionImage={
                        <Arrow
                            team={player.teamKey}
                            direction={transformDirectionsIntoSingleDirection(specialMove.specialMove.directions)}
                            isSpecial
                            size="board"
                            squareDimension={SQUARE_DIMENSION}
                        />
                    }
                    addedByPlayer={specialMove.addedByPlayer}
                    {...commonProps}
                />
            );
        },
        switchPlacesWithPiece: switchPlacesWithPiece => {
            const adjustedRowAndColumn = adjustRowAndColumnByMultipleDirections(
                switchPlacesWithPiece.switchPlaces.start.row,
                switchPlacesWithPiece.switchPlaces.start.column,
                switchPlacesWithPiece.switchPlaces.directions,
            );
            return (
                <Action
                    action={switchPlacesWithPiece}
                    actionDescription={
                        <div>
                            Earth at{" "}
                            {translateRowAndColumn(
                                switchPlacesWithPiece.switchPlaces.start.row,
                                switchPlacesWithPiece.switchPlaces.start.column,
                            )}{" "}
                            attempting to switch with{" "}
                            {translateRowAndColumn(adjustedRowAndColumn.row, adjustedRowAndColumn.column)}
                        </div>
                    }
                    actionImage={
                        <SwitchArrows team={player.teamKey} squareDimension={SQUARE_DIMENSION * 0.9} shouldNotAdjust />
                    }
                    addedByPlayer={switchPlacesWithPiece.addedByPlayer}
                    {...commonProps}
                />
            );
        },
        unknown: () => <div>Unknown action</div>,
    });
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        player: state.game.player,
        gameBoard: state.game.gameBoard,
    };
}

export const StagedAction = connect(mapStateToProps)(UnconnectedStagedAction);
