import { ITeamRid, IAllTeams, IBoardTeamMetadata } from "@stract/api";

export function getTeamKeyFromRid(teamRid: ITeamRid, teams: IAllTeams<IBoardTeamMetadata>): keyof IAllTeams<any> {
    return teams.north.id === teamRid ? "north" : "south";
}
