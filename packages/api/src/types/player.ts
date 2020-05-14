import { ITeamRid } from "./team";

export interface IPlayer {
    /**
     * This is not typed, because the identifier here should be a purely backend concept. Adding it
     * here just in case the frontend needs to de-conflict user names.
     */
    id?: string;
    name: string;
    team: ITeamRid;
}
