import { useState } from "react";

export const useRefresh = () =>{
    const [refreshIndex, setRefreshIndex] = useState(0);
    const refresh = () => setRefreshIndex(refreshIndex + 1);

    return {
        refresh,
        refreshIndex
    };
}