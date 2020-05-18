export interface IErrorMessage {
    errorCode?: number;
    intent: "success" | "danger" | "warning";
    message: string;
}
