import { NonIdealState, Icon } from "@blueprintjs/core";
import { IPlayer, ITeamRid } from "@stract/api";
import classNames from "classnames";
import * as React from "react";
import { IRegisterWithTeam, capitalizeFirst } from "../../utils";
import styles from "./teamSelection.module.scss";

interface IOwnProps {
    currentPlayer: Partial<IPlayer>;
    onTeamSelection: (teamRid: ITeamRid) => void;
    teams: IRegisterWithTeam[];
}

type IProps = IOwnProps;

function renderOtherPlayers(otherPlayers: Array<Partial<IPlayer>>) {
    if (otherPlayers.length === 0) {
        return <NonIdealState description="No players" />;
    }

    return otherPlayers.map(player => <div className={styles.teamMember}>{player.name ?? "You"}</div>);
}

export function TeamSelection(props: IProps) {
    const { currentPlayer, onTeamSelection, teams } = props;

    const handleTeamSelect = (teamRid: ITeamRid) => () => onTeamSelection(teamRid);

    return (
        <div className={styles.teamSelectionContainer}>
            {teams.map(team => (
                <div
                    className={classNames(styles.individualTeam, {
                        [styles.active]: currentPlayer.team === team.id,
                        [styles.north]: team.teamName === "north",
                        [styles.south]: team.teamName === "south",
                    })}
                    onClick={handleTeamSelect(team.id)}
                >
                    <div
                        className={classNames(styles.title, {
                            [styles.northTitle]: team.teamName === "north",
                            [styles.southTitle]: team.teamName === "south",
                        })}
                    >
                        {capitalizeFirst(team.teamName)}
                        {currentPlayer.team === team.id && <Icon icon="tick" />}
                    </div>
                    <div className={styles.teamMembersContainer}>
                        {renderOtherPlayers(
                            currentPlayer.team === team.id
                                ? [
                                      ...team.otherPlayers,
                                      { name: `${capitalizeFirst(currentPlayer.name ?? "No name")} (You)` },
                                  ]
                                : team.otherPlayers,
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
