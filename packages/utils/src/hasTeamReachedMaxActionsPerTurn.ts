import { IGameAction } from "@stract/api";

export function hasTeamReachedMaxActionsPerTurn(stagedActions: IGameAction[], maxActionsPerTurn: number) {
    return stagedActions.length >= maxActionsPerTurn;
}
