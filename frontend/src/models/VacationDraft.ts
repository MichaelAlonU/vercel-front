export default interface VacationDraft {

    destination: string
    description: string
    startTime: string;
    endTime: string;
    price: number;
    image?: File | null;
}