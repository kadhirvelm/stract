import { IAllTeams, IGameAction } from "@stract/api";
import { noop } from "lodash-es";
import { IStoreState } from "../store";
import { createDeepSelectorCreator } from "./selectorUtils";
import { ITilesInStagedActions, getRowColumnKey } from "../utils";

export const getTilesUsedInStagedActions = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.stagedActions,
    (state: IStoreState) => state.game.player?.teamKey,
    (stagedActions?: IAllTeams<IGameAction[]>, playerTeamKey?: keyof IAllTeams<any>): ITilesInStagedActions => {
        if (stagedActions === undefined || playerTeamKey === undefined) {
            return new Map();
        }

        const finalTilesUsedInStagedActions = new Map();
        stagedActions[playerTeamKey].forEach(action => {
            IGameAction.visit(action, {
                movePiece: mp =>
                    finalTilesUsedInStagedActions.set(
                        getRowColumnKey(mp.movePiece.start.row, mp.movePiece.start.column),
                        mp.type,
                    ),
                spawnPiece: sp =>
                    finalTilesUsedInStagedActions.set(
                        getRowColumnKey(sp.spawnPiece.row, sp.spawnPiece.column),
                        sp.type,
                    ),
                specialMovePiece: spm =>
                    finalTilesUsedInStagedActions.set(
                        getRowColumnKey(spm.specialMove.start.row, spm.specialMove.start.column),
                        spm.type,
                    ),
                switchPlacesWithPiece: sw =>
                    finalTilesUsedInStagedActions.set(
                        getRowColumnKey(sw.switchPlaces.start.row, sw.switchPlaces.start.column),
                        sw.type,
                    ),
                unknown: noop,
            });
        });

        return finalTilesUsedInStagedActions;
    },
);
