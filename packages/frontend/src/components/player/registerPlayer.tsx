import * as React from "react";
import { IPlayer, ITeamRid } from "@stract/api";
import { connect } from "react-redux";
import { Spinner, InputGroup, Button } from "@blueprintjs/core";
import { PartialBy } from "@stract/api/dist/common/partialBy";
import { IStoreState } from "../../store";
import { getTeams } from "../../selectors";
import { IRegisterWithTeam } from "../../utils";
import { sendServerMessage } from "../../socket";
import styles from "./registerPlayer.module.scss";
import { TeamSelection } from "./teamSelection";

interface IStoreProps {
    teams?: IRegisterWithTeam[];
}

type IProps = IStoreProps;

function UnconnectedRegisterPlayer(props: IProps) {
    const [temporaryPlayer, updateTemporaryPlayer] = React.useState<Partial<IPlayer>>({});

    const { teams } = props;
    if (teams === undefined) {
        return <Spinner />;
    }

    const updateUserName = (event: React.ChangeEvent<HTMLInputElement>) =>
        updateTemporaryPlayer({ ...temporaryPlayer, name: event.currentTarget.value });

    const updateTeam = (teamRid: ITeamRid) => updateTemporaryPlayer({ ...temporaryPlayer, team: teamRid });

    const isPlayerComplete = (player: Partial<IPlayer>): player is PartialBy<IPlayer, "id"> =>
        player.name !== undefined && player.team !== undefined;

    const registerPlayer = () => {
        if (!isPlayerComplete(temporaryPlayer)) {
            return;
        }

        sendServerMessage().registerPlayer({ name: temporaryPlayer.name, team: temporaryPlayer.team });
    };

    return (
        <div className={styles.registerPlayerContainer}>
            <InputGroup
                className={styles.nameInput}
                placeholder="Name"
                onChange={updateUserName}
                value={temporaryPlayer.name ?? ""}
            />
            <TeamSelection currentPlayer={temporaryPlayer} onTeamSelection={updateTeam} teams={teams} />
            <div className={styles.registerButtonContainer}>
                <Button
                    disabled={!isPlayerComplete(temporaryPlayer)}
                    intent="success"
                    onClick={registerPlayer}
                    text="Register!"
                />
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStoreProps {
    return {
        teams: getTeams(state),
    };
}

export const RegisterPlayer = connect(mapStateToProps)(UnconnectedRegisterPlayer);
