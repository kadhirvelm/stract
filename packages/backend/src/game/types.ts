import {
    IPlayer,
    IPlayerIdentifier,
    ITeamRid,
    IStractGameV1,
    IGameAction,
    IGameState,
    IGameActionId,
} from "@stract/api";

export interface IStractPlayer {
    /**
     * ID of the given player.
     */
    id: IPlayerIdentifier | undefined;
    /**
     * Name of the player.
     */
    name: string | undefined;
    /**
     * The team rid the player belongs to.
     */
    team: ITeamRid | undefined;
    /**
     * Returns the current player's IPlayer object. If it hasn't been registered yet, returns undefined.
     */
    getPlayer: () => IPlayer | undefined;
}

export interface IStractGame {
    /**
     * The current game state.
     */
    currentGameState: IStractGameV1;
    /**
     * Registers a player to a team, adding it to the currentGameState's team list.
     */
    addPlayerToTeam: (stractPlayer: IStractPlayer) => void;
    /**
     * Adds a staged action to the given player's team for current turn.
     */
    addStagedAction: (stagedAction: IGameAction, stractPlayer: IStractPlayer) => void;
    /**
     * Updates the game state, say from in-play to paused, or from not-started to in-play.
     */
    changeGameState: (newGameState: IGameState) => void;
    /**
     * When a player disconnect, this removes them from the currentGameState.
     */
    removePlayerFromTeam: (stractPlayer: IStractPlayer) => void;
    /**
     * Removes a staged action from the current turn.
     */
    removeStagedAction: (team: ITeamRid, id: IGameActionId) => void;
    /**
     * Updates all players connected to the game with the latest game state.
     */
    sendGameUpdateToAllPlayers: () => void;
}
