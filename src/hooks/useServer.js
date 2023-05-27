import {useMemo} from "react";
import Server from "../services/server";

const useServer = () => {
    return  useMemo(() => {
        return new Server();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export default useServer;