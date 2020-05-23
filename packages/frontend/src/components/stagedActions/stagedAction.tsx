import { IGameAction, IGameActionType, IPlayerIdentifier, IStractGameV1, IGameActionId } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "@blueprintjs/core";
import { IStoreState } from "../../store";
import { IPlayerWithTeamKey } from "../../utils";
import styles from "./stagedAction.module.scss";
import { sendServerMessage } from "../../socket";

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
    addedByPlayer: IPlayerIdentifier | undefined;
    currentPlayer: IPlayerWithTeamKey;
    gameBoard: IStractGameV1;
    otherPlayerInfo: React.ReactElement;
    samePlayerInfo: React.ReactElement;
}) {
    const { addedByPlayer, currentPlayer, gameBoard, action, samePlayerInfo, otherPlayerInfo } = props;
    if (currentPlayer === undefined || currentPlayer.teamKey === undefined || addedByPlayer === undefined) {
        return null;
    }

    const humanReadableType = (type: IGameActionType) => {
        if (type === "move-piece") {
            return "Move";
        }

        if (type === "spawn-piece") {
            return "Spawn";
        }

        if (type === "special-move-piece") {
            return "Special Move";
        }

        return "";
    };

    const playerName = gameBoard.teams[currentPlayer.teamKey].players.find(p => p.id === addedByPlayer);

    const removeAction = (actionId: IGameActionId) => () =>
        sendServerMessage().removeStagedAction({ id: actionId, player: currentPlayer.id });

    const maybeRenderDeleteButton = () => {
        if (action.addedByPlayer !== currentPlayer.id) {
            return null;
        }

        return (
            <div className={styles.buttonContainer}>
                <Button icon="cross" intent="danger" minimal onClick={removeAction(action.id)} />
            </div>
        );
    };

    return (
        <div className={styles.stagedContainer}>
            <div className={styles.stagedContainerInfo}>
                <div className={styles.typeAndName}>
                    <span>{humanReadableType(action.type)}</span>
                    <span>{playerName?.name}</span>
                </div>
                <div className={styles.playerInfo}>
                    {currentPlayer.id === addedByPlayer ? samePlayerInfo : otherPlayerInfo}
                </div>
            </div>
            {maybeRenderDeleteButton()}
        </div>
    );
}

function UnconnectedStagedAction(props: IProps) {
    const { gameBoard, player, stagedAction } = props;
    if (gameBoard === undefined || player === undefined || player.teamKey === undefined) {
        return null;
    }

    return IGameAction.visit(stagedAction, {
        movePiece: move => (
            <Action
                action={move}
                addedByPlayer={move.addedByPlayer}
                currentPlayer={player}
                gameBoard={gameBoard}
                otherPlayerInfo={<div>A move was made by a teammate.</div>}
                samePlayerInfo={
                    <div>
                        Piece at ({move.movePiece.start.row + 1}, {move.movePiece.start.column + 1}){" "}
                        {move.movePiece.direction}{" "}
                    </div>
                }
            />
        ),
        spawnPiece: spawn => (
            <Action
                action={spawn}
                addedByPlayer={spawn.addedByPlayer}
                currentPlayer={player}
                gameBoard={gameBoard}
                otherPlayerInfo={
                    <div>
                        Create a {spawn.spawnPiece.pieceType} at {spawn.spawnPiece.row + 1},{" "}
                        {spawn.spawnPiece.column + 1}
                    </div>
                }
                samePlayerInfo={
                    <div>
                        Create a {spawn.spawnPiece.pieceType} at {spawn.spawnPiece.row + 1},{" "}
                        {spawn.spawnPiece.column + 1}
                    </div>
                }
            />
        ),
        specialMovePiece: specialMove => (
            <Action
                action={specialMove}
                addedByPlayer={specialMove.addedByPlayer}
                currentPlayer={player}
                gameBoard={gameBoard}
                otherPlayerInfo={<div>A special move was made a player</div>}
                samePlayerInfo={
                    <div>
                        Piece at ({specialMove.specialMove.start.row + 1}, {specialMove.specialMove.start.column + 1}){" "}
                        {specialMove.specialMove.directions.join(", ")}{" "}
                    </div>
                }
            />
        ),
        switchPlacesWithPiece: switchPlacesWithPiece => (
            <Action
                action={switchPlacesWithPiece}
                addedByPlayer={switchPlacesWithPiece.addedByPlayer}
                currentPlayer={player}
                gameBoard={gameBoard}
                otherPlayerInfo={<div>A special move was made a player</div>}
                samePlayerInfo={
                    <div>
                        Earth piece at {switchPlacesWithPiece.switchPlaces.start.row},{" "}
                        {switchPlacesWithPiece.switchPlaces.start.column} is targeting a switch with the tile{" "}
                        {switchPlacesWithPiece.switchPlaces.directions} away.
                    </div>
                }
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
