import { IGameAction, IGameActionType, IPlayerIdentifier, IStractGameV1 } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { IPlayerWithTeamKey } from "../../utils";
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

        return "Spawn";
    };

    const playerName = gameBoard.teams[currentPlayer.teamKey].players.find(p => p.id === addedByPlayer);

    return (
        <div className={styles.stagedContainer}>
            <div className={styles.typeAndName}>
                <span>{humanReadableType(action.type)}</span>
                <span>{playerName?.name}</span>
            </div>
            <div className={styles.playerInfo}>
                {currentPlayer.id === addedByPlayer ? samePlayerInfo : otherPlayerInfo}
            </div>
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
                otherPlayerInfo={<div>Some random move was made</div>}
                samePlayerInfo={
                    <div>
                        Piece at ({move.movePiece.startRow}, {move.movePiece.startColumn}) {move.movePiece.direction}{" "}
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
                        Create a {spawn.spawnPiece.pieceType} at {spawn.spawnPiece.row}, {spawn.spawnPiece.column}
                    </div>
                }
                samePlayerInfo={
                    <div>
                        Create a {spawn.spawnPiece.pieceType} at {spawn.spawnPiece.row}, {spawn.spawnPiece.column}
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
