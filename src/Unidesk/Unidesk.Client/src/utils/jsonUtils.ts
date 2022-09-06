import { SimpleJsonResponse } from "@models/SimpleJsonResponse";

export const serverResponseOrDefault = (response: unknown): SimpleJsonResponse|undefined => {
    if (response !== null && typeof response === "object"  && "message" in response && "success" in response) {
        return response as SimpleJsonResponse;
    }
    return undefined;
}