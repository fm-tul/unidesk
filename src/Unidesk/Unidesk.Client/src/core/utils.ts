
/*
message: string;
title?: string | null;
type: ToastType;
*/

import { ToastType } from "@models/ToastType";

export interface ToastMessage {
    message: string;
    title: string;
    type: ToastType;
}

export const getToastMessageOrDefault = (item: unknown) => {
    if (typeof item === "string") {
        return null;
    }
    
    if (!!item && typeof item === "object") {
        // verify if it's a toast message
        if (item.hasOwnProperty("message") && item.hasOwnProperty("type")) {
            const toast = item as ToastMessage;
            toast.title = toast.title || toast.type;
            return toast;
        }
    }
    
    return null;
}