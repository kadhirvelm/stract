import { IBoardTeamMetadata, IStractGameV1, IAllTeams } from "@stract/api";
import { merge } from "lodash-es";
import { createSelector } from "reselect";
import { IStoreState } from "../store";
import { ITeamRidToTeamKey } from "../utils";

export const getTeamRidToTeamKey = createSelector(
    (state: IStoreState) => state.game.gameBoard,
    (gameBoard?: IStractGameV1): ITeamRidToTeamKey => {
        if (gameBoard === undefined) {
            return {};
        }

        return Object.entries(gameBoard.teams)
            .map((entry: [string, IBoardTeamMetadata]) => ({ [entry[1].id]: entry[0] as keyof IAllTeams<any> }))
            .reduce(merge);
    },
);
