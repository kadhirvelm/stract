import { IBoardTeamPiecePool, IAllTeams } from "@stract/api";
import * as React from "react";
import { BoardPiece } from "../pieces";
import styles from "./piecePool.module.scss";

interface IOwnProps {
    piecePool: IBoardTeamPiecePool[];
    team: keyof IAllTeams<any>;
}

type IProps = IOwnProps;

export function PiecePool(props: IProps) {
    const { piecePool, team } = props;
    return (
        <div className={styles.pieceContainer}>
            {piecePool
                .filter(piece => piece.total > 0)
                .map(piece => (
                    <div className={styles.singlePiece}>
                        <span className={styles.total}>{piece.total}</span>{" "}
                        <BoardPiece piece={piece.type} team={team} />
                    </div>
                ))}
        </div>
    );
}
