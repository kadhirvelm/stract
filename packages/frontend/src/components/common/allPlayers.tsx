import * as React from "react";
import { IBoardTeamMetadata, IAllTeams } from "@stract/api";
import { connect } from "react-redux";
import { IPlayerWithTeamKey, getOtherTeam } from "../../utils";
import { IStoreState } from "../../store";

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
        <div>
            {teams[currentPlayer.teamKey].players.length}
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
