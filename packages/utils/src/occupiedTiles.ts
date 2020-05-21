import { IOccupiedBy, ITeamRid } from "@stract/api";

export function doesTileHaveOccupiedByAliveAndTeam(occupiedBy: IOccupiedBy[], teamRid: ITeamRid) {
    const onlyAlive = occupiedBy.find(ob => IOccupiedBy.isAlive(ob));
    if (onlyAlive === undefined || !IOccupiedBy.isAlive(onlyAlive)) {
        return false;
    }

    return onlyAlive.piece.ownedByTeam === teamRid;
}
