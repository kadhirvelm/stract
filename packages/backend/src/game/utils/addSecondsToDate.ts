export function addSecondsToDate(seconds: number) {
    const secondsToMilliseconds = seconds * 1000;

    return new Date(new Date().valueOf() + secondsToMilliseconds);
}
