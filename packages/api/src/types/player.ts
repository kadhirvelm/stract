import { ITeamRid } from "./team";
import { Brand, createBrandedGeneric } from "../common/brandType";
import { PartialBy } from "../common/partialBy";

export type IPlayerIdentifier = Brand<string, "player-identifier">;
export const playerIdentifier = createBrandedGeneric<string, IPlayerIdentifier>();

export interface IPlayer {
    id: IPlayerIdentifier;
    name: string;
    team: ITeamRid;
}

export type IRegisterPlayer = PartialBy<IPlayer, "id">;
