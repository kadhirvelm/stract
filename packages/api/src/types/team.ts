import { ITeamRid, IPlayerIdentifier } from "./idTypes";

export interface ITeam {
    id: ITeamRid;
    name: string;
    players: IPlayerIdentifier[];
}
