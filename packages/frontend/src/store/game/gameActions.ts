import { TypedAction } from "redoodle";
import { IStractGame } from "@stract/api";

export const UpdateGameBoard = TypedAction.define("@stract/frontend/update-game-board")<IStractGame>();
