import { ITeamRid, IAllTeams } from "@stract/api";
import io from "socket.io";
import { IStractPlayer } from "../types";

export type ITeamToPlayersMapping = Map<
    ITeamRid,
    { players: IStractPlayer[]; teamKey: keyof IAllTeams<any>; teamSocket: io.Namespace }
>;
