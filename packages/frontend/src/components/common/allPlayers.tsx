import * as React from "react";
import { IBoardTeamMetadata, IAllTeams } from "@stract/api";
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

    return (
        <div className={styles.mainContainer}>
            <span>Your team</span>
            {teams[currentPlayer.teamKey].players.length}
            <span>The other team</span>
            {teams[getOtherTeam(currentPlayer.teamKey)].players.length}
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
