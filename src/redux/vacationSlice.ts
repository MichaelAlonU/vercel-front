import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Vacation from "../models/Vacation";

interface VacationState {
    newVacation?: Vacation
    vacations: Vacation[]
}

const initialState: VacationState = {
    newVacation: undefined,
    vacations: []
};

export const vacationSlice = createSlice({
    name: 'vacations',
    initialState,
    reducers: {
        init: (state, action: PayloadAction<Vacation[]>) => {
            state.vacations = action.payload;
        },
        addFollower: (state, action: PayloadAction<{ vacId: string; userId: string }>) => {
            const v = state.vacations.find(v => v.id === action.payload.vacId);
            if (v) v.followers?.push({ id: action.payload.userId });
        },
        removeFollower: (state, action: PayloadAction<{ vacId: string; userId: string }>) => {
            const v = state.vacations.find(v => v.id === action.payload.vacId);
            if (v) v.followers = v.followers?.filter(f => f.id !== action.payload.userId);
        },
        markFollowedByCurrentUser: (state, action: PayloadAction<{ vacId: string }>) => {
            const v = state.vacations.find(v => v.id === action.payload.vacId);
            if (v) v.isFollowed = true;
        },

        markUnfollowedByCurrentUser: (state, action: PayloadAction<{ vacId: string }>) => {
            const v = state.vacations.find(v => v.id === action.payload.vacId);
            if (v) v.isFollowed = false;
        },

        newVacation: (state, action: PayloadAction<Vacation>) => {
            // state.posts = [action.payload, ...state.posts]
            // state.newVacation = action.payload;
            state.vacations = [action.payload, ...state.vacations];
        },
        updateVacation: (state, action: PayloadAction<Vacation>) => {
            const idx = state.vacations.findIndex(p => p.id === action.payload.id);
            if (idx > -1) {
                const oldVal = state.vacations[idx].isFollowed;
                state.vacations[idx] = { ...action.payload, isFollowed: oldVal };
            } 
        },
        deleteVacation: (state, action: PayloadAction<string>) => {
            state.vacations = state.vacations.filter(p => p.id !== action.payload);
        },

    }
});

export const { init, newVacation, updateVacation, deleteVacation, addFollower, removeFollower, markFollowedByCurrentUser, markUnfollowedByCurrentUser } = vacationSlice.actions;

export default vacationSlice.reducer;