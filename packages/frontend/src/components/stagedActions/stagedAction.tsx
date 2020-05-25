import { Button } from "@blueprintjs/core";
import { IBoardTeamMetadata, IGameAction, IGameActionId, IPlayerIdentifier, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { sendServerMessage } from "../../socket";
import { IStoreState } from "../../store";
import {
    IPlayerWithTeamKey,
    transformDirectionsIntoSingleDirection,
    translateRowAndColumn,
    translateColumn,
} from "../../utils";
import { Arrow, Spawn, SwitchArrows } from "../pieces";
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
                <span>{playerName}</span>
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

    return IGameAction.visit(stagedAction, {
        movePiece: move => (
            <Action
                action={move}
                actionDescription={
                    <div>
                        {translateRowAndColumn(move.movePiece.start.row, move.movePiece.start.column)}{" "}
                        {move.movePiece.direction}
                    </div>
                }
                actionImage={<Arrow team={player.teamKey} direction={move.movePiece.direction} size="board" />}
                addedByPlayer={move.addedByPlayer}
                {...commonProps}
            />
        ),
        spawnPiece: spawn => (
            <Action
                action={spawn}
                actionDescription={
                    <div>
                        {" "}
                        {spawn.spawnPiece.pieceType} at {translateColumn(spawn.spawnPiece.column)}
                    </div>
                }
                actionImage={<Spawn team={player.teamKey} size="board" />}
                addedByPlayer={spawn.addedByPlayer}
                {...commonProps}
            />
        ),
        specialMovePiece: specialMove => (
            <Action
                action={specialMove}
                actionDescription={
                    <div>
                        {translateRowAndColumn(specialMove.specialMove.start.row, specialMove.specialMove.start.column)}
                        {transformDirectionsIntoSingleDirection(specialMove.specialMove.directions)}
                    </div>
                }
                actionImage={
                    <Arrow
                        team={player.teamKey}
                        direction={transformDirectionsIntoSingleDirection(specialMove.specialMove.directions)}
                        size="board"
                    />
                }
                addedByPlayer={specialMove.addedByPlayer}
                {...commonProps}
            />
        ),
        switchPlacesWithPiece: switchPlacesWithPiece => (
            <Action
                action={switchPlacesWithPiece}
                actionDescription={
                    <div>
                        Earth at
                        {translateRowAndColumn(
                            switchPlacesWithPiece.switchPlaces.start.row,
                            switchPlacesWithPiece.switchPlaces.start.column,
                        )}
                        attempting to switch with{" "}
                        {transformDirectionsIntoSingleDirection(switchPlacesWithPiece.switchPlaces.directions)}
                    </div>
                }
                actionImage={<SwitchArrows team={player.teamKey} />}
                addedByPlayer={switchPlacesWithPiece.addedByPlayer}
                {...commonProps}
            />
        ),
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
