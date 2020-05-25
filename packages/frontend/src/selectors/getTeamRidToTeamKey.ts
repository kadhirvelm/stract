import { IAllTeams, IBoardTeamMetadata } from "@stract/api";
import { merge } from "lodash-es";
import { IStoreState } from "../store";
import { ITeamRidToTeamKey } from "../utils";
import { createDeepSelectorCreator } from "./selectorUtils";

export const getTeamRidToTeamKey = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.teams,
    (teams?: IAllTeams<IBoardTeamMetadata>): ITeamRidToTeamKey => {
        if (teams === undefined) {
            return {};
        }

        return Object.entries(teams)
            .map((entry: [string, IBoardTeamMetadata]) => ({ [entry[1].id]: entry[0] as keyof IAllTeams<any> }))
            .reduce(merge);
    },
);
