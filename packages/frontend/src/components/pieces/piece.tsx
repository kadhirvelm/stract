import { IGamePiece } from "@stract/api";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { ITeamRidToTeamKey } from "../../utils";
import { Circle, Square, Triangle } from "./pieceSvg";
import { getTeamRidToTeamKey } from "../../selectors";

interface IOwnProps {
    piece: IGamePiece;
    squareDimension: number;
}

interface IStateProps {
    teamRidToTeamKey: ITeamRidToTeamKey;
}

type IProps = IOwnProps & IStateProps;

function UnconnectedPiece(props: IProps) {
    const { piece, squareDimension, teamRidToTeamKey } = props;

    const team = teamRidToTeamKey[piece.ownedByTeam];

    if (team === undefined) {
        return <div>No team</div>;
    }

    return IGamePiece.visit(piece, {
        circle: () => <Circle team={team} squareDimension={squareDimension} size="board" />,
        square: () => <Square team={team} squareDimension={squareDimension} size="board" />,
        triangle: () => <Triangle team={team} squareDimension={squareDimension} size="board" />,
        unknown: () => <div>Unknown</div>,
    });
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        teamRidToTeamKey: getTeamRidToTeamKey(state),
    };
}

export const Piece = connect(mapStateToProps)(UnconnectedPiece);
