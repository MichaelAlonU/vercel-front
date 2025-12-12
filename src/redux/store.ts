import { configureStore } from "@reduxjs/toolkit";
import vacationSlice, { addFollower, removeFollower, markFollowedByCurrentUser, markUnfollowedByCurrentUser } from "./vacationSlice";
import authSlice from "./auth-slice";
import socket from "../../io/io";
import { jwtDecode } from "jwt-decode";
import { v4 as uuid } from "uuid";

export const clientId = uuid();

const store = configureStore({
    reducer: {
        auth: authSlice,
        vacations: vacationSlice,
    }
});

interface JwtPayload { id: string }

socket.on("vacation-like", (payload: any) => {
    const token = localStorage.getItem('jwt');
    const currentUserId = token ? jwtDecode<JwtPayload>(token).id : null;

    if (payload.from === clientId) return;
    if (payload.type === "follow") {
        store.dispatch(addFollower({ vacId: payload.vacationId, userId: payload.userId }));
    } else {
        store.dispatch(removeFollower({ vacId: payload.vacationId, userId: payload.userId }));
    }

    if (payload.userId === currentUserId) {
        store.dispatch(
            payload.type === "follow"
                ? markFollowedByCurrentUser({ vacId: payload.vacationId })
                : markUnfollowedByCurrentUser({ vacId: payload.vacationId })
        );
    }

});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch