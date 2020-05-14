import { IBoardTeamMetadata, IStractGameV1 } from "@stract/api";
import { createSelector } from "reselect";
import { IStoreState } from "../store";
import { IRegisterWithTeam } from "../utils/types";

export const getTeams = createSelector(
    (state: IStoreState) => state.game.gameBoard,
    (gameBoard?: IStractGameV1): IRegisterWithTeam[] | undefined => {
        if (gameBoard === undefined) {
            return undefined;
        }

        return Object.entries(gameBoard.teams).map((teamEntry: [string, IBoardTeamMetadata]) => ({
            teamName: teamEntry[0],
            id: teamEntry[1].id,
            otherPlayers: teamEntry[1].players,
        }));
    },
);
