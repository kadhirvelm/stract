import { TypedAction } from "redoodle";
import { IStractGameV1, IPlayer } from "@stract/api";
import { ILastPong } from "../../utils";

export const UpdateGameBoard = TypedAction.define("@stract/frontend/update-game-board")<IStractGameV1>();

export const RegisterPlayer = TypedAction.define("@stract/frontend/register-player")<IPlayer | undefined>();

export const UpdateSocketHealth = TypedAction.define("@stract/frontend/update-socket-health")<ILastPong>();
