import { IAllTeams, IGameAction, IGameTile, IGameTileFree, IPlayer, IStractGameV1, ITeamRid } from "@stract/api";

export interface ICanAddStagedActionToTile {
    isValid: boolean;
    canSpawn?: boolean;
}

/**
 * This works for moving a piece, special moving a piece, or switching places with a piece.
 */
function canExecuteActionFromTile(
    tile: IGameTileFree,
    rowIndex: number,
    columnIndex: number,
    playerTeamRid: ITeamRid,
    playerTeamStagedActions: IGameAction[],
) {
    const doAnyExistingStagedActionsMoveTheSamePiece = playerTeamStagedActions.some(a => {
        return (
            (IGameAction.isMovePiece(a) &&
                a.movePiece.startRow === rowIndex &&
                a.movePiece.startColumn === columnIndex) ||
            (IGameAction.isSpecialMovePiece(a) &&
                a.specialMove.startRow === rowIndex &&
                a.specialMove.startColumn === columnIndex) ||
            (IGameAction.isSwitchPlacesWithPiece(a) &&
                a.switchPlaces.start.row === rowIndex &&
                a.switchPlaces.start.column === columnIndex)
        );
    });

    if (doAnyExistingStagedActionsMoveTheSamePiece) {
        return { isValid: false };
    }

    return { isValid: tile.occupiedBy[0]?.ownedByTeam === playerTeamRid };
}

function canSpawnTile(gameBoard: IStractGameV1, playerTeamKey: keyof IAllTeams<any>, rowIndex: number) {
    const canSpawn = playerTeamKey === "north" ? rowIndex === 0 : rowIndex === gameBoard.metadata.board.size.rows - 1;
    const hasTilesAvailable = gameBoard.teams[playerTeamKey].piecePool.available.some(piecePool => piecePool.total > 0);

    return { isValid: canSpawn && hasTilesAvailable, canSpawn };
}

export function canAddAnyStagedActionToTile(
    player: IPlayer,
    gameBoard: IStractGameV1,
    rowIndex: number,
    columnIndex: number,
): ICanAddStagedActionToTile {
    const tile = gameBoard.board[rowIndex]?.[columnIndex];
    const playerTeamKey: keyof IAllTeams<any> = gameBoard.teams.north.id === player.team ? "north" : "south";

    if (tile === undefined) {
        return { isValid: false };
    }

    if (!IGameTile.isFree(tile)) {
        return { isValid: false };
    }

    let isValid = false;
    if (tile?.occupiedBy !== undefined && tile?.occupiedBy.length > 0) {
        isValid = canExecuteActionFromTile(
            tile,
            rowIndex,
            columnIndex,
            player.team,
            gameBoard.stagedActions[playerTeamKey],
        ).isValid;
    }

    const getCanSpawn = canSpawnTile(gameBoard, playerTeamKey, rowIndex);
    return {
        isValid: getCanSpawn.isValid || isValid,
        canSpawn: getCanSpawn.canSpawn,
    };
}
