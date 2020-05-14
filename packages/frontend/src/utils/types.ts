import { IPlayer, ITeamRid } from "@stract/api";

export interface IRegisterWithTeam {
    teamName: string;
    id: ITeamRid;
    otherPlayers: IPlayer[];
}
