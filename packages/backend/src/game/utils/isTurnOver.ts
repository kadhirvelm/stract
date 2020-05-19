export function isTurnOver(nextTurnTimestamp: number) {
    return new Date().valueOf() - nextTurnTimestamp > 0;
}
