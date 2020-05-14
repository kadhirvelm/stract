import io from "socket.io";
import {
    StractGameSocketService,
    IPlayerIdentifier,
    playerIdentifier,
    IStractToServer,
    IStractFromServer,
    ITeamRid,
    IPlayer,
} from "@stract/api";
import { v4 } from "uuid";
import { IStractPlayer, IStractGame } from "./types";

export class StractPlayer implements IStractPlayer {
    public id: IPlayerIdentifier | undefined;
    public name: string | undefined;
    public team: ITeamRid | undefined;

    private fromClient: IStractToServer["fromClient"];
    private toClient: IStractFromServer["toClient"];

    constructor(private socket: io.Socket, private game: IStractGame) {
        this.fromClient = StractGameSocketService.backend.fromClient(socket);
        this.toClient = StractGameSocketService.backend.toClient(socket);

        this.setupPlayerListeners();
    }

    public getPlayer = (): IPlayer | undefined => {
        if (this.id === undefined || this.name === undefined || this.team === undefined) {
            return undefined;
        }

        return { id: this.id, name: this.name, team: this.team };
    };

    private setupPlayerListeners = () => {
        this.fromClient.addStagedAction(gameAction => {
            // TODO: handle error case
            this.game.addStagedAction(gameAction, this);
        });

        this.fromClient.getGameUpdate(this.sendGameUpdate);

        this.fromClient.registerPlayer(player => {
            if (this.name === player.name && this.team === player.team) {
                return;
            }

            // First we set the player identifiers
            this.id = player.id ?? playerIdentifier(v4());
            this.name = player.name;
            this.team = player.team;

            // Then we have the socket join the team's room
            this.socket.join(this.team);

            // Then we add the player to the game's teamToPlayersMapping
            this.game.addPlayerToTeam(this);

            // Then we reply to the user they've been successfully registered and gives them their ID
            const thisPlayer = this.getPlayer();
            if (thisPlayer === undefined) {
                // eslint-disable-next-line no-console
                console.error(
                    "Something went terribly wrong, tried to reply to a registration with an undefined player.",
                    this.id,
                    this.name,
                    this.team,
                );
                return;
            }

            this.toClient.onRegisterPlayer(thisPlayer);
        });

        this.socket.on("disconnect", () => this.game.removePlayerFromTeam(this));
    };

    private sendGameUpdate = () => {
        this.toClient.onGameUpdate(this.game.currentGameState);
    };
}
