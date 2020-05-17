import { IStractGameV1, CURRENT_GAME_STATE_VERSION } from "@stract/api";

export function sanitizeExistingBoard(existingBoardState: IStractGameV1 | undefined) {
    if (existingBoardState === undefined || existingBoardState?.version !== CURRENT_GAME_STATE_VERSION) {
        return undefined;
    }

    return existingBoardState;
}
