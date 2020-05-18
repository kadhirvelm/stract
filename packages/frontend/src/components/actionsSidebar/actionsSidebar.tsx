import { NonIdealState, Button } from "@blueprintjs/core";
import { IAllTeams, IBoardTeamMetadata, IGameAction, IGameState, IStractGameV1, ITurnsMetadata } from "@stract/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { getDimensions, IPlayerWithTeamKey } from "../../utils";
import { StagedAction } from "../stagedActions";
import styles from "./actionsSidebar.module.scss";
import { PiecePool } from "./piecePool";
import { sendServerMessage } from "../../socket";
import { SelfUpdatingTimer } from "../common";

interface IStoreProps {
    gameBoard?: IStractGameV1;
    player?: IPlayerWithTeamKey;
}

type IProps = IStoreProps;

function TurnNumber(props: { turn: number; turnMetadata: ITurnsMetadata }) {
    const { turn, turnMetadata } = props;
    const { totalTurns } = turnMetadata;

    return (
        <div className={styles.turn}>
            <span className={styles.turnTitle}>Turn</span>
            <span className={styles.turnNumber}>
                {turn} / {totalTurns}
            </span>
        </div>
    );
}

function GameState(props: { gameState: IGameState; onChangeGameState: (newGameState: IGameState) => void }) {
    const { gameState, onChangeGameState } = props;

    const requestPause = () => {
        if (!IGameState.isInPlay(gameState)) {
            return;
        }

        onChangeGameState(IGameState.requestPause(gameState.nextTurnTimestamp));
    };
    const requestPlay = () => onChangeGameState(IGameState.requestPlay());

    return (
        <div className={styles.gameState}>
            {IGameState.visit(gameState, {
                notStarted: () => <div>Waiting…</div>,
                requestPlay: () => <div>Starting…</div>,
                inPlay: inPlay => <SelfUpdatingTimer nextTurnTimestamp={inPlay.nextTurnTimestamp} />,
                requestPause: requestForPause => (
                    <div>
                        <SelfUpdatingTimer nextTurnTimestamp={requestForPause.nextTurnTimestamp} /> Pausing…
                    </div>
                ),
                paused: () => <div>Paused</div>,
                ended: () => <div>Ended</div>,
                unknown: () => <div>Unknown</div>,
            })}
            <Button
                className={styles.changeStateButton}
                disabled={IGameState.isRequestPause(gameState) || IGameState.isRequestPlay(gameState)}
                icon={IGameState.isInPlay(gameState) ? "pause" : "play"}
                minimal
                onClick={IGameState.isInPlay(gameState) ? requestPause : requestPlay}
            />
        </div>
    );
}

function StagedActions(props: { player: IPlayerWithTeamKey; stagedActions: IAllTeams<IGameAction[]> }) {
    const { stagedActions, player } = props;
    if (player.teamKey === undefined) {
        return null;
    }

    const teamActions = stagedActions[player.teamKey];
    if (teamActions.length === 0) {
        return <NonIdealState description="Your team has no staged actions" />;
    }

    return (
        <div className={styles.stagedActionsList}>
            <div className={styles.stagedActionsTitle}>Your team will:</div>
            {teamActions.map(stagedAction => (
                <StagedAction key={stagedAction.id} stagedAction={stagedAction} />
            ))}
        </div>
    );
}

function TeamScores(props: { north: number; south: number }) {
    const { north, south } = props;
    return (
        <div className={styles.bothTeamsContainer}>
            <span className={classNames(styles.oneTeam, styles.oneTeamScore)}>{north}</span>
            <span className={classNames(styles.oneTeam, styles.oneTeamScore)}>{south}</span>
        </div>
    );
}

function TeamPiecePools(props: { north: IBoardTeamMetadata; south: IBoardTeamMetadata }) {
    const { north, south } = props;
    return (
        <div className={styles.bothTeamsContainer}>
            <span className={styles.oneTeam}>
                <PiecePool piecePool={north.piecePool.total} team="north" />
            </span>
            <span className={styles.oneTeam}>
                <PiecePool piecePool={south.piecePool.total} team="south" />
            </span>
        </div>
    );
}

export function UnconnectedActionsSidebar(props: IProps) {
    const { gameBoard, player } = props;
    if (gameBoard === undefined || player === undefined) {
        return null;
    }

    const { sidebarWidth } = getDimensions(gameBoard.metadata.board);

    const onChangeGameState = (newGameState: IGameState) => sendServerMessage().changeGameState(newGameState);

    return (
        <div className={styles.actionsSidebar} style={{ width: sidebarWidth }}>
            <div className={classNames(styles.section, styles.turnAndGameSection)}>
                <TurnNumber turn={gameBoard.turnNumber} turnMetadata={gameBoard.metadata.turns} />
                <GameState gameState={gameBoard.state} onChangeGameState={onChangeGameState} />
            </div>
            <div className={classNames(styles.section, styles.bothTeamInformation)}>
                <div className={styles.bothTeamsContainer}>
                    <span className={styles.oneTeam}>{gameBoard.teams.north.name}</span>
                    vs.
                    <span className={styles.oneTeam}>{gameBoard.teams.south.name}</span>
                </div>
                <TeamScores north={gameBoard.teams.north.score} south={gameBoard.teams.south.score} />
                <TeamPiecePools north={gameBoard.teams.north} south={gameBoard.teams.south} />
            </div>
            <div className={classNames(styles.section, styles.stagedActionsContainer)}>
                <StagedActions player={player} stagedActions={gameBoard.stagedActions} />
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        gameBoard: state.game.gameBoard,
        player: state.game.player,
    };
}

export const ActionsSidebar = connect(mapStateToProps)(UnconnectedActionsSidebar);
