import { TypedAction } from "redoodle";
import { IStractGameV1 } from "@stract/api";

export const UpdateGameBoard = TypedAction.define("@stract/frontend/update-game-board")<IStractGameV1>();
