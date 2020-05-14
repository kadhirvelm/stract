import { createBrandedGeneric, Brand } from "@stract/api";

export type IPlayerIdentifier = Brand<string, "player-identifier">;
export const playerIdentifier = createBrandedGeneric<string, IPlayerIdentifier>();
