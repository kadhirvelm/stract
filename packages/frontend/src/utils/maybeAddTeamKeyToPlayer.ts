import { IStractGameV1, IAllTeams } from "@stract/api";
import { IPlayerWithTeamKey } from "./types";

function getTeamKey(
    board: IStractGameV1 | undefined,
    player: IPlayerWithTeamKey | undefined,
): keyof IAllTeams<any> | undefined {
    if (board === undefined && player === undefined) {
        return undefined;
    }

    if (board?.teams.north.id === player?.team) {
        return "north";
    }

    if (board?.teams.south.id === player?.team) {
        return "south";
    }

    return undefined;
}

export function maybeAddTeamKeyToPlayer(board: IStractGameV1 | undefined, player: IPlayerWithTeamKey | undefined) {
    if (board === undefined || player === undefined || player.teamKey !== undefined) {
        return player;
    }

    const playerCopy = { ...player };
    playerCopy.teamKey = getTeamKey(board, playerCopy);

    return playerCopy;
}
