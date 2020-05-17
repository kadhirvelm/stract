import { IStractGameV1 } from "@stract/api";
import io from "socket.io";
import { ITeamToPlayersMapping } from "./utilTypes";

export function createNewTeamToPlayerMapping(
    currentGameState: IStractGameV1,
    roomSocket: io.Namespace,
): ITeamToPlayersMapping {
    return new Map([
        [
            currentGameState.teams.north.id,
            {
                players: [],
                teamKey: "north",
                teamSocket: roomSocket.to(currentGameState.teams.north.id),
            },
        ],
        [
            currentGameState.teams.south.id,
            {
                players: [],
                teamKey: "south",
                teamSocket: roomSocket.to(currentGameState.teams.south.id),
            },
        ],
    ]);
}
