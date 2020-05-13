import { Server } from "http";
import io from "socket.io";
import { StractGameSocketService, IGameTile, teamId, stractBoardId, IStractGame } from "@stract/api";
import _ from "lodash";

function createBoard(x: number, y: number): IGameTile[][] {
    return _.range(0, x).map(() => _.range(0, y).map(() => ({ type: "free" })));
}

export function setupGameSocket(server: Server) {
    const socketConnection = io(server);

    socketConnection.on("connection", socket => {
        const currentGameState: IStractGame = {
            metadata: {
                board: {
                    size: {
                        columns: 10,
                        rows: 10,
                    },
                },
                id: stractBoardId("sample-stract-game"),
                roomName: "Sample game board",
            },
            board: createBoard(10, 10),
            stagedActions: {
                north: [],
                south: [],
            },
            teams: {
                north: {
                    id: teamId("north-team"),
                    name: "North team",
                    piecePool: {
                        available: [{ total: 10, type: "circle" }],
                        total: [{ total: 10, type: "circle" }],
                    },
                },
                south: {
                    id: teamId("south-team"),
                    name: "South team",
                    piecePool: {
                        available: [{ total: 10, type: "circle" }],
                        total: [{ total: 10, type: "circle" }],
                    },
                },
            },
            turnNumber: 1,
        };

        const fromClient = StractGameSocketService.backend.fromClient(socket);
        const toClient = StractGameSocketService.backend.toClient(socket);

        // eslint-disable-next-line no-console
        console.log("Socket connected", socket.id);

        fromClient.getGameUpdate(() => {
            toClient.onGameUpdate(currentGameState);
        });

        fromClient.addStagedAction((gameAction, socketMetadata) => {
            // TODO: determine what team this socket is on
            currentGameState.stagedActions.north.push({
                ...gameAction,
                ownedByTeam: teamId(socketMetadata.socketIdentifier),
            });

            toClient.onGameUpdate(currentGameState);
        });
    });
}
