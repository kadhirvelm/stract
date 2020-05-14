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

export class StractGame {
    public currentGameState: IStractGameV1;

    private roomSocket: io.Namespace;
    private teamToPlayersMapping: Map<ITeamRid, { teamKey: keyof IAllTeams<any>; players: StractPlayer[] }>;
    private toAllClients: IStractFromServer["toClient"];

    constructor(server: Server, public roomName: string) {
        this.roomSocket = io(server).of(roomName);
        this.toAllClients = StractGameSocketService.backend.toClient(this.roomSocket);
        this.currentGameState = createNewGame();

        this.teamToPlayersMapping = new Map([
            [this.currentGameState.teams.north.id, { teamKey: "north", players: [] }],
            [this.currentGameState.teams.south.id, { teamKey: "south", players: [] }],
        ]);

        this.setupGameListeners();
    }

    private setupGameListeners = () => {
        this.roomSocket.on("connection", socket => new StractPlayer(socket, this));
    };

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

    public addStagedAction = (stagedAction: IGameAction, stractPlayer: StractPlayer) => {
        const team = this.maybeGetPlayerTeam(stractPlayer);
        if (team === undefined) {
            return;
        }

        this.currentGameState.stagedActions[team.teamKey].push(stagedAction);
        this.sendGameUpdateToAllPlayers();
    };

    private maybeGetPlayerTeam = (stractPlayer: StractPlayer) => {
        if (stractPlayer.team === undefined) {
            return undefined;
        }

        return this.teamToPlayersMapping.get(stractPlayer.team);
    };
}
