import * as React from "react";
import { IBoardTeamPiecePool } from "@stract/api";
import styles from "./piecePool.module.scss";

interface IOwnProps {
    piecePool: IBoardTeamPiecePool[];
}

type IProps = IOwnProps;

export function PiecePool(props: IProps) {
    const { piecePool } = props;
    return (
        <div className={styles.pieceContainer}>
            {piecePool.map(piece => (
                <div>
                    {piece.total} {piece.type}
                </div>
            ))}
        </div>
    );
}
