import { IOccupiedBy } from "@stract/api";
import { noop } from "lodash-es";
import { playSound, SOUNDS } from "./playSound";

export function maybePlaySoundsForTile(occupiedBy: IOccupiedBy | undefined) {
    IOccupiedBy.visit(occupiedBy, {
        alive: noop,
        destroyed: () => setTimeout(() => playSound(SOUNDS.DESTROY), 1100),
        scored: () => setTimeout(() => playSound(SOUNDS.SCORE), 2100),
        undefined: noop,
        unknown: noop,
    });
}
