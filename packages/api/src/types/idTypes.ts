import { Brand, createBrandedGeneric } from "../common";

export type IColumnIndex = Brand<number, "column-index">;
export const columnIndex = createBrandedGeneric<number, IColumnIndex>();

export type IGameActionId = Brand<string, "game-action-id">;
export const gameActionId = createBrandedGeneric<string, IGameActionId>();

export type IGamePieceId = Brand<string, "game-piece">;
export const gamePieceId = createBrandedGeneric<string, IGamePieceId>();

export type IPlayerIdentifier = Brand<string, "player-identifier">;
export const playerIdentifier = createBrandedGeneric<string, IPlayerIdentifier>();

export type IRowIndex = Brand<number, "row-index">;
export const rowIndex = createBrandedGeneric<number, IRowIndex>();

export type IStractBoardId = Brand<string, "board-id">;
export const stractBoardId = createBrandedGeneric<string, IStractBoardId>();

export type ITeamRid = Brand<string, "team-id">;
export const teamId = createBrandedGeneric<string, ITeamRid>();
