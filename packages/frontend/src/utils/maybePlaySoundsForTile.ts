import { IOccupiedBy } from "@stract/api";
import { noop } from "lodash-es";
import { playSound, SOUNDS } from "./playSound";

export function maybePlaySoundsForTile(occupiedBy: IOccupiedBy | undefined) {
    IOccupiedBy.visit(occupiedBy, {
        alive: noop,
        destroyed: () => playSound(SOUNDS.DESTROY),
        scored: () => setTimeout(() => playSound(SOUNDS.SCORE), 1100),
        undefined: noop,
        unknown: noop,
    });
}
