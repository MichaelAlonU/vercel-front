import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function useService<T>(ServiceClass: new (jwt: string) => T): T {
    const jwt= useSelector((state: RootState) => state.auth.jwt);
    return new ServiceClass(jwt);
}
