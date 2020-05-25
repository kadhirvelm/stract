import {
    IGameAction,
    IPlayer,
    IPlayerIdentifier,
    IRegisterPlayer,
    IStractFromServer,
    IStractToServer,
    ITeamRid,
    playerIdentifier,
    StractGameSocketService,
    IGameState,
    IGameActionId,
} from "@stract/api";
import io from "socket.io";
import { v4 } from "uuid";
import { isValidStagedAction, getTeamKeyFromRid, hasTeamReachedMaxActionsPerTurn } from "@stract/utils";
import { IStractGame, IStractPlayer } from "./types";

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

    private addStagedAction = (gameAction: IGameAction) => {
        if (this.team === undefined) {
            this.toClient.onMessage({ message: "Invalid team, please try refreshing your page.", intent: "danger" });
            return;
        }

        if (
            !IGameState.isInPlay(this.game.currentGameState.state) &&
            !IGameState.isRequestPause(this.game.currentGameState.state)
        ) {
            this.toClient.onMessage({
                message: "Unfortunately the game is playing right now. We can't accept your action.",
                intent: "warning",
            });
            return;
        }

        const team = getTeamKeyFromRid(this.team, this.game.currentGameState.teams);
        if (
            hasTeamReachedMaxActionsPerTurn(
                this.game.currentGameState.stagedActions[team],
                this.game.currentGameState.metadata.turns.maxActionsPerTurn,
            )
        ) {
            this.toClient.onMessage({
                message:
                    "Your team has reached it's maximum staged actions limit for this turn. Either wait, or delete an existing staged action.",
                intent: "warning",
            });
            return;
        }

        const isValidAction = isValidStagedAction(this.game.currentGameState, gameAction, this.team);
        if (!isValidAction.isValid) {
            this.toClient.onMessage({ message: isValidAction.message ?? "Invalid action", intent: "danger" });
            return;
        }

        this.game.addStagedAction({ ...gameAction, addedByPlayer: this.id }, this);
    };

    private changeGameState = (gameState: IGameState) => {
        if (IGameState.isRequestPause(gameState)) {
            this.toClient.onMessage({
                message: "We'll update the game state right after this turn.",
                intent: "success",
            });
        }

        this.game.changeGameState(gameState);
    };

    private registerPlayer = (player: IRegisterPlayer) => {
        if (player != null && this.name === player.name && this.team === player.team) {
            return;
        }

        // First we set the player identifiers
        this.id = player.id ?? playerIdentifier(v4());
        this.name = player.name;
        this.team = player.team;

        // Then we have the socket join the team's room
        this.socket.join(this.team);

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

        this.toClient.onRegisterPlayerUpdate(thisPlayer);

        try {
            // Then we add the player to the game's teamToPlayersMapping
            this.game.addPlayerToTeam(this);
        } catch {
            // Which throws an error if the player is trying to connect to a game that doesn't exist anymore
            this.toClient.onRegisterPlayerUpdate(undefined);
        }
    };

    private removeStagedAction = (removeStagedAction: { id: IGameActionId; player: IPlayerIdentifier }) => {
        const { player, id } = removeStagedAction;
        if (this.id !== player) {
            this.toClient.onMessage({ message: "You cannot remove an action from another player.", intent: "danger" });
            return;
        }

        if (this.team === undefined) {
            return;
        }

        this.game.removeStagedAction(this.team, id);
    };

    private unregisterPlayer = (_playerIdentifier: IPlayerIdentifier) => this.game.removePlayerFromTeam(this);

    private setupPlayerListeners = () => {
        this.fromClient.addStagedAction(this.addStagedAction);
        this.fromClient.changeGameState(this.changeGameState);
        this.fromClient.getGameUpdate(this.sendGameUpdate);
        this.fromClient.registerPlayer(this.registerPlayer);
        this.fromClient.removeStagedAction(this.removeStagedAction);
        this.fromClient.unregisterPlayer(this.unregisterPlayer);

        this.socket.on("disconnect", () => this.game.removePlayerFromTeam(this));
    };

    private sendGameUpdate = () => {
        this.toClient.onGameUpdate(this.game.currentGameState);
    };
}
