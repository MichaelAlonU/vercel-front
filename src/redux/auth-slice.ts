import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
    jwt: string;
    isLoggedIn: boolean;
    user: {
        id?: string;
        fName: string;
        lName: string;
        role: string;
        isAdmin: boolean;
    };
}

function decode(jwt: string | null) {
    if (!jwt) return { fName: "", lName: "", role: "USER", isAdmin: false };

    try {
        const payload = jwtDecode<{ id: string, firstName: string, lastName: string, roleName: string }>(jwt);
        return {
            id: payload.id,
            fName: payload.firstName,
            lName: payload.lastName,
            role: payload.roleName,
            isAdmin: payload.roleName === "ADMIN",
        };
    } catch {
        return { id: "", fName: "", lName: "", role: "USER", isAdmin: false };
    }
}

const jwtFromStorage = localStorage.getItem("jwt");
const decoded = decode(jwtFromStorage);

const initialState: AuthState = {
    jwt: jwtFromStorage ?? '',
    isLoggedIn: !!jwtFromStorage,
    user: {
        id: decoded.id,
        fName: decoded.fName,
        lName: decoded.lName,
        role: decoded.role,
        isAdmin: decoded.isAdmin}
    };

    export const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
            login: (state, action: PayloadAction<string>) => {
                state.jwt = action.payload
                const payload = decode(action.payload);
                state.user.id = payload.id
                state.user.fName = payload.fName
                state.user.lName = payload.lName
                state.user.role = payload.role
                state.user.isAdmin = payload.isAdmin
                state.isLoggedIn = true

            },
            logout: (state) => {
                state.jwt = ''
                state.isLoggedIn = false
                state.user.id = ''
                state.user.fName = ''
                state.user.lName = ''
                state.user.role = "USER"
                state.user.isAdmin = false
                localStorage.removeItem("jwt");
            }
        }
    });

    export const { login, logout } = authSlice.actions;

    export default authSlice.reducer;