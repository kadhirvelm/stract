import { Brand, ISocketIdentifer, createBrandedGeneric } from "../common";

export type ITeamRid = Brand<string, "team-id">;
export const teamId = createBrandedGeneric<string, ITeamRid>();

export interface ITeam {
    id: ITeamRid;
    name: string;
    players: ISocketIdentifer[];
}
