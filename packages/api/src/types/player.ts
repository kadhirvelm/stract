import { PartialBy } from "../common/partialBy";
import { IPlayerIdentifier, ITeamRid } from "./idTypes";

export interface IPlayer {
    id: IPlayerIdentifier;
    name: string;
    team: ITeamRid;
}

export type IRegisterPlayer = PartialBy<IPlayer, "id">;
