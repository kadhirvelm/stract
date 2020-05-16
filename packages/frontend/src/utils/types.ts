import { IPlayer, ITeamRid } from "@stract/api";

export interface IRegisterWithTeam {
    teamName: string;
    id: ITeamRid;
    otherPlayers: IPlayer[];
}

export interface ILastPong {
    latency: number;
    timeStamp: Date;
}
