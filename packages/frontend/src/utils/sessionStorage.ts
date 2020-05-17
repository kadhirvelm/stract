import { IPlayerWithTeamKey } from "./types";

const PLAYER_KEY = "stract-player-key-v1";

export function storePlayer(player: IPlayerWithTeamKey | undefined) {
    window.sessionStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function getPlayer(): IPlayerWithTeamKey | undefined {
    try {
        const player = window.sessionStorage.getItem(PLAYER_KEY);
        if (player == null) {
            return undefined;
        }

        return JSON.parse(player) as IPlayerWithTeamKey;
    } catch {
        return undefined;
    }
}
