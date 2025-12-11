import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function useUsername() {
    return useSelector((state: RootState) => state.auth.user.fName);
}
