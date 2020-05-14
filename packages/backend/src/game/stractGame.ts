import {
    IAllTeams,
    IGameAction,
    IStractFromServer,
    IStractGameV1,
    ITeamRid,
    StractGameSocketService,
} from "@stract/api";
import { Server } from "http";
import io from "socket.io";
import { StractPlayer } from "./stractPlayer";
import { createNewGame } from "./utils/createNewGame";
import { IStractGame } from "./types";

export class StractGame implements IStractGame {
    public currentGameState: IStractGameV1;

    private roomSocket: io.Namespace;
    private teamToPlayersMapping: Map<
        ITeamRid,
        { players: StractPlayer[]; teamKey: keyof IAllTeams<any>; teamSocket: io.Namespace }
    >;
    private toAllClients: IStractFromServer["toClient"];

    constructor(server: Server, public roomName: string, existingBoard?: IStractGameV1) {
        this.roomSocket = io(server).of(roomName);
        this.toAllClients = StractGameSocketService.backend.toClient(this.roomSocket);
        this.currentGameState = existingBoard ?? createNewGame({ roomName });

        this.teamToPlayersMapping = new Map([
            [
                this.currentGameState.teams.north.id,
                { players: [], teamKey: "north", teamSocket: this.roomSocket.to(this.currentGameState.teams.north.id) },
            ],
            [
                this.currentGameState.teams.south.id,
                { players: [], teamKey: "south", teamSocket: this.roomSocket.to(this.currentGameState.teams.south.id) },
            ],
        ]);

        this.setupGameListeners();
    }

    public addPlayerToTeam = (stractPlayer: StractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined || stractPlayer.name === undefined) {
            return;
        }

        const player = stractPlayer.getPlayer();
        if (player === undefined) {
            return;
        }

        team?.players.push(stractPlayer);
        this.currentGameState.teams[team.teamKey].players.push(player);

        this.sendGameUpdateToAllPlayers();
    };

    public addStagedAction = (stagedAction: IGameAction, stractPlayer: StractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined) {
            return;
        }

        this.currentGameState.stagedActions[team.teamKey].push(stagedAction);
        this.sendGameUpdateToAllPlayers();
    };

    public removePlayerFromTeam = (stractPlayer: StractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined) {
            return;
        }

        team.players = team.players.filter(player => player.id !== stractPlayer.id);
        this.currentGameState.teams[team.teamKey].players = this.currentGameState.teams[team.teamKey].players.filter(
            player => player.id !== stractPlayer.id,
        );

        this.sendGameUpdateToAllPlayers();
    };

    public sendGameUpdateToAllPlayers = () => this.toAllClients.onGameUpdate(this.currentGameState);

    /**
     * Private methods
     */

    private setupGameListeners = () => {
        this.roomSocket.on("connection", socket => new StractPlayer(socket, this));
    };

    private maybeGetPlayerTeam = (stractPlayer: StractPlayer) => {
        if (stractPlayer.team === undefined) {
            return undefined;
        }

        return this.teamToPlayersMapping.get(stractPlayer.team);
    };
}
