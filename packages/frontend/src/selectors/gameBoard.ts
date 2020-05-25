import { IAllTeams, IBoardTeamMetadata, IGameAction, IGameState } from "@stract/api";
import { hasTeamReachedMaxActionsPerTurn } from "@stract/utils";
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

export const canPlayerAddMoreActions = createDeepSelectorCreator(
    (state: IStoreState) => state.game.gameBoard?.state,
    (state: IStoreState) => state.game.gameBoard?.stagedActions,
    (state: IStoreState) => state.game.gameBoard?.metadata.turns.maxActionsPerTurn,
    (state: IStoreState) => state.game.player?.teamKey,
    (
        gameState?: IGameState,
        stagedActions?: IAllTeams<IGameAction[]>,
        maxActionsPerTurn?: number,
        teamKey?: keyof IAllTeams<any>,
    ): boolean => {
        if (
            gameState === undefined ||
            stagedActions === undefined ||
            maxActionsPerTurn === undefined ||
            teamKey === undefined
        ) {
            return false;
        }

        return !hasTeamReachedMaxActionsPerTurn(stagedActions[teamKey], maxActionsPerTurn); // &&
        // (IGameState.isInPlay(gameState) || IGameState.isRequestPause(gameState))
    },
);
