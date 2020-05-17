import { TypedAction } from "redoodle";
import { ISelectedTile } from "../../utils";

export const ChangeSelectedTile = TypedAction.define("@stract/frontend/change-selected-tile")<
    ISelectedTile | undefined
>();
