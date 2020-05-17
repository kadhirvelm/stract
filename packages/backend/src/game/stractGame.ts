import { IGameAction, IStractFromServer, IStractGameV1, StractGameSocketService } from "@stract/api";
import { Server } from "http";
import io from "socket.io";
import { StractPlayer } from "./stractPlayer";
import { IStractGame, IStractPlayer } from "./types";
import { createNewGame, createNewTeamToPlayerMapping, ITeamToPlayersMapping } from "./utils";
import { sanitizeExistingBoard } from "./utils/sanitizeExistingBoard";

const TIME_PER_TURN = 20;
const TOTAL_TURNS = 45;

export class StractGame implements IStractGame {
    public currentGameState: IStractGameV1;

    private roomSocket: io.Namespace;
    private teamToPlayersMapping: ITeamToPlayersMapping;
    private toAllClients: IStractFromServer["toClient"];

    constructor(
        server: Server,
        public roomName: string,
        existingBoard?: IStractGameV1,
        private saveGame?: (game: IStractGameV1) => void,
    ) {
        this.roomSocket = io(server, { pingInterval: 5000 }).of(roomName);
        this.toAllClients = StractGameSocketService.backend.toClient(this.roomSocket);
        this.currentGameState =
            sanitizeExistingBoard(existingBoard) ??
            createNewGame({ roomName, timePerTurnInSeconds: TIME_PER_TURN, totalTurns: TOTAL_TURNS });
        this.teamToPlayersMapping = createNewTeamToPlayerMapping(this.currentGameState, this.roomSocket);

        this.setupGameListeners();
    }

    public addPlayerToTeam = (stractPlayer: IStractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined || stractPlayer.name === undefined) {
            throw new Error("Hum, it seems the game you're trying to connect to doesn't exist.");
        }

        const player = stractPlayer.getPlayer();
        if (player === undefined || team.players.find(p => p.id === stractPlayer.id) !== undefined) {
            return;
        }

        team?.players.push(stractPlayer);
        this.modifyGameState(() => {
            if (this.currentGameState.teams[team.teamKey].players.find(p => p.id === player.id) !== undefined) {
                return;
            }

            this.currentGameState.teams[team.teamKey].players.push(player);
        });
    };

    public addStagedAction = (stagedAction: IGameAction, stractPlayer: IStractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined) {
            return;
        }

        this.modifyGameState(() => this.currentGameState.stagedActions[team.teamKey].push(stagedAction));
    };

    public removePlayerFromTeam = (stractPlayer: IStractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined) {
            return;
        }

        team.players = team.players.filter(player => player.id !== stractPlayer.id);
        this.modifyGameState(() => {
            this.currentGameState.teams[team.teamKey].players = this.currentGameState.teams[
                team.teamKey
            ].players.filter(player => player.id !== stractPlayer.id);
        });
    };

    public sendGameUpdateToAllPlayers = () => {
        this.toAllClients.onGameUpdate(this.currentGameState);
    };

    /**
     * Private methods
     */

    private setupGameListeners = () => {
        this.roomSocket.on("connect", socket => new StractPlayer(socket, this));
    };

    private maybeGetPlayerTeam = (stractPlayer: IStractPlayer) => {
        if (stractPlayer.team === undefined) {
            return undefined;
        }

        return this.teamToPlayersMapping.get(stractPlayer.team);
    };

    private modifyGameState = (modify: () => void) => {
        modify();
        this.saveGame?.(this.currentGameState);
        this.sendGameUpdateToAllPlayers();
    };
}
