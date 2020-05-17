import { IPlayer, ITeamRid, IAllTeams } from "@stract/api";

export interface IRegisterWithTeam {
    teamName: string;
    id: ITeamRid;
    otherPlayers: IPlayer[];
}

export interface ILastPong {
    latency: number;
    timeStamp: Date;
}

export interface IPlayerWithTeamKey extends IPlayer {
    teamKey?: keyof IAllTeams<any>;
}
