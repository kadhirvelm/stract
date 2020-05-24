import { IGameAction } from "@stract/api";

export function sortStagedActions(a: IGameAction, b: IGameAction) {
    if (IGameAction.isSwitchPlacesWithPiece(a) && !IGameAction.isSwitchPlacesWithPiece(b)) {
        return 1;
    }

    if (IGameAction.isSwitchPlacesWithPiece(b) && !IGameAction.isSwitchPlacesWithPiece(a)) {
        return -1;
    }

    return a.timestamp > b.timestamp ? 1 : -1;
}
