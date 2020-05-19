import { IGamePiece } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { Icon } from "@blueprintjs/core";
import { IStoreState } from "../../store";
import { ITeamRidToTeamKey, IPlayerWithTeamKey } from "../../utils";
import { Fire, Earth, Water, HiddenPiece } from "./pieceSvg";
import { getTeamRidToTeamKey } from "../../selectors";
import styles from "./piece.module.scss";

interface IOwnProps {
    piece: IGamePiece;
    squareDimension: number;
}

interface IStateProps {
    player?: IPlayerWithTeamKey;
    teamRidToTeamKey: ITeamRidToTeamKey;
}

type IProps = IOwnProps & IStateProps;

function UnconnectedPiece(props: IProps) {
    const { piece, squareDimension, player, teamRidToTeamKey } = props;

    const team = teamRidToTeamKey[piece.ownedByTeam];

    if (team === undefined || player === undefined) {
        return <div>No team or player</div>;
    }

    if (piece.ownedByTeam !== player.team && piece.isHidden) {
        return <HiddenPiece team={team} squareDimension={squareDimension} size="board" />;
    }

    const maybeRenderHidden = () => {
        if (!piece.isHidden) {
            return null;
        }

        return (
            <div className={styles.hidden}>
                <Icon icon="eye-off" iconSize={Icon.SIZE_LARGE} />
            </div>
        );
    };

    return (
        <div className={styles.pieceContainer}>
            {IGamePiece.visit(piece, {
                fire: () => <Fire team={team} squareDimension={squareDimension} size="board" />,
                earth: () => <Earth team={team} squareDimension={squareDimension} size="board" />,
                water: () => <Water team={team} squareDimension={squareDimension} size="board" />,
                unknown: () => <div>Unknown</div>,
            })}
            {maybeRenderHidden()}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        player: state.game.player,
        teamRidToTeamKey: getTeamRidToTeamKey(state),
    };
}

export const Piece = connect(mapStateToProps)(UnconnectedPiece);
