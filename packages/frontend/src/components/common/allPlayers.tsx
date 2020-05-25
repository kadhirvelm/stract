import * as React from "react";
import { IBoardTeamMetadata, IAllTeams, IPlayer } from "@stract/api";
import { connect } from "react-redux";
import { IPlayerWithTeamKey, getOtherTeam } from "../../utils";
import { IStoreState } from "../../store";
import styles from "./allPlayers.module.scss";

interface IStoreProps {
    currentPlayer: IPlayerWithTeamKey | undefined;
    teams: IAllTeams<IBoardTeamMetadata> | undefined;
}

type IProps = IStoreProps;

function UnconnectedAllPlayers(props: IProps) {
    const { currentPlayer, teams } = props;
    if (currentPlayer === undefined || currentPlayer.teamKey === undefined || teams === undefined) {
        return null;
    }

    const renderSinglePlayer = (player: IPlayer) => <span className={styles.teamMember}>{player.name}</span>;

    const maybeRenderTeamPlayers = (players: IPlayer[]) => {
        if (players.length === 0) {
            return <span className={styles.noTeamMembers}>No players</span>;
        }

        return players.map(renderSinglePlayer);
    };

    return (
        <div className={styles.mainContainer}>
            <span className={styles.teamTitle}>Your team</span>
            <div className={styles.teamContainer}>{maybeRenderTeamPlayers(teams[currentPlayer.teamKey].players)}</div>
            <span className={styles.teamTitle}>The other team</span>
            <div className={styles.teamContainer}>
                {maybeRenderTeamPlayers(teams[getOtherTeam(currentPlayer.teamKey)].players)}
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        currentPlayer: state.game.player,
        teams: state.game.gameBoard?.teams,
    };
}

export const AllPlayers = connect(mapStateToProps)(UnconnectedAllPlayers);
