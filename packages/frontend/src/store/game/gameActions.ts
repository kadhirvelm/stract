import { TypedAction } from "redoodle";
import { IStractGameV1, IPlayer } from "@stract/api";

export const UpdateGameBoard = TypedAction.define("@stract/frontend/update-game-board")<IStractGameV1>();

export const RegisterPlayer = TypedAction.define("@stract/frontend/register-player")<IPlayer | undefined>();
