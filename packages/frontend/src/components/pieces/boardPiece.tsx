import * as React from "react";
import { IGamePieceType, IAllTeams } from "@stract/api";
import { Circle, Square, Triangle } from "./pieceSvg";

interface IOwnProps {
    piece: IGamePieceType;
    team: keyof IAllTeams<any>;
}

type IProps = IOwnProps;

export function BoardPiece(props: IProps) {
    const { piece, team } = props;
    switch (piece) {
        case "circle":
            return <Circle team={team} size="sidebar" />;
        case "square":
            return <Square team={team} size="sidebar" />;
        case "triangle":
            return <Triangle team={team} size="sidebar" />;
        default:
            return <div>Unknown</div>;
    }
}
