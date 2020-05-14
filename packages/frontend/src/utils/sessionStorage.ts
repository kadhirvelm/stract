import { IPlayer } from "@stract/api";

const PLAYER_KEY = "stract-player-key-v1";

export function storePlayer(player: IPlayer | undefined) {
    window.sessionStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function getPlayer(): IPlayer | undefined {
    try {
        const player = window.sessionStorage.getItem(PLAYER_KEY);
        if (player == null) {
            return undefined;
        }

        return JSON.parse(player) as IPlayer;
    } catch {
        return undefined;
    }
}
