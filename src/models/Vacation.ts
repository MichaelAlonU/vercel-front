import VacationDraft from "./VacationDraft";

export default interface Vacation extends VacationDraft {
    id: string,
    imageUrl: string,
    createdAt: string,
    isFollowed: boolean,
    followers?: { id: string }[]  // array of the user's IDs who follow this vacation
};