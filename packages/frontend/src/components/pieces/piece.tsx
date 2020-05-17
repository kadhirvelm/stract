import { IGamePiece, IAllTeams } from "@stract/api";
import * as React from "react";
import { Circle, Square, Triangle } from "./pieceSvg";

interface IOwnProps {
    piece: IGamePiece;
    team: keyof IAllTeams<any>;
}

type IProps = IOwnProps;

export function Piece(props: IProps) {
    const { piece, team } = props;

    return IGamePiece.visit(piece, {
        circle: () => <Circle team={team} />,
        square: () => <Square team={team} />,
        triangle: () => <Triangle team={team} />,
        unknown: () => <div>Unknown</div>,
    });
}
