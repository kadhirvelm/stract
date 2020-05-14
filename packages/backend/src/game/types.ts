import { IPlayer, IPlayerIdentifier, ITeamRid, IStractGameV1, IGameAction } from "@stract/api";

export interface IStractPlayer {
    id: IPlayerIdentifier | undefined;
    name: string | undefined;
    team: ITeamRid | undefined;
    getPlayer: () => IPlayer | undefined;
}

export interface IStractGame {
    currentGameState: IStractGameV1;
    addPlayerToTeam: (stractPlayer: IStractPlayer) => void;
    addStagedAction: (stagedAction: IGameAction, stractPlayer: IStractPlayer) => void;
    removePlayerFromTeam: (stractPlayer: IStractPlayer) => void;
    sendGameUpdateToAllPlayers: () => void;
}
