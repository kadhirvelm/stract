export interface IErrorMessage {
    errorCode?: number;
    intent: "success" | "danger" | "warning";
    message: string;
}

/**
 * Valid directions to push a piece in.
 */
export type IDirection = "north" | "west" | "south" | "east";
