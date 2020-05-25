import { IAllTeams, IBoardTeamMetadata, IGameAction } from "@stract/api";
import { IStoreState } from "../store";
import { IRegisterWithTeam } from "../utils";
import { createDeepSelectorCreator } from "./selectorUtils";

export const getTeams = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.teams,
    (teams?: IAllTeams<IBoardTeamMetadata>): IRegisterWithTeam[] | undefined => {
        if (teams === undefined) {
            return undefined;
        }

        return Object.entries(teams).map((teamEntry: [string, IBoardTeamMetadata]) => ({
            teamName: teamEntry[0],
            id: teamEntry[1].id,
            otherPlayers: teamEntry[1].players,
        }));
    },
);

export const hasPlayerTeamReachedMaxStagedActions = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.stagedActions,
    (state: IStoreState) => state.game.gameBoard?.metadata.turns.totalTurns,
    (state: IStoreState) => state.game.player?.teamKey,
    (stagedActions?: IAllTeams<IGameAction[]>, totalTurns?: number, teamKey?: keyof IAllTeams<any>): boolean => {
        if (stagedActions === undefined || totalTurns === undefined || teamKey === undefined) {
            return true;
        }

        return stagedActions[teamKey].length < totalTurns;
    },
);
