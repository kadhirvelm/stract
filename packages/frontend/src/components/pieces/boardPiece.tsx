import * as React from "react";
import { IGamePieceType, IAllTeams } from "@stract/api";
import { Fire, Earth, Water } from "./allTileSvgs";

interface IOwnProps {
    piece: IGamePieceType;
    team: keyof IAllTeams<any>;
}

type IProps = IOwnProps;

export function BoardPiece(props: IProps) {
    const { piece, team } = props;
    switch (piece) {
        case "fire":
            return <Fire team={team} size="sidebar" />;
        case "earth":
            return <Earth team={team} size="sidebar" />;
        case "water":
            return <Water team={team} size="sidebar" />;
        default:
            return <div>Unknown</div>;
    }
}
