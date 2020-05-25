import { IAllTeams } from "@stract/api";

export function getOtherTeam(team: keyof IAllTeams<any>): keyof IAllTeams<any> {
    return team === "north" ? "south" : "north";
}
