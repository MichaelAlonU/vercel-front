import Vacation from "../../models/Vacation";
import VacationDraft from "../../models/VacationDraft";
import AuthAware from "./AuthAware";

export default class VacationService extends AuthAware {

    async getAll(): Promise<Vacation[]> {
        const response = await this.axiosInstance.get<Vacation[]>(`/vacations`);
                
        return response.data;
    }

    async remove(id: string): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/vacations/${id}`);
        return response.data;
    }

    async newVacation(draft: VacationDraft): Promise<Vacation> {

        // const fd = new FormData();
        // fd.append("destination", draft.destination);
        // fd.append("description", draft.description);
        // fd.append("startTime", draft.startTime);
        // fd.append("endTime", draft.endTime);
        // fd.append("price", draft.price.toString());
        // if (draft.image) {
        //     fd.append("image", draft.image as File);
        // }
        // console.log(`from service: `, draft.image);
        // const { data } = await this.axiosInstance.post(`/vacations`, fd)

        const response = await this.axiosInstance.post<Vacation>(`/vacations`, draft, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("VacationService.newVacation response.data:", response.data);
        return response.data;
    }

    async editVacation(id: string, draft: VacationDraft): Promise<Vacation> {
        const response = await this.axiosInstance.patch<Vacation>(`/vacations/${id}`, draft, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async unfollow(vacationId: string): Promise<Vacation> {
        const { data } = await this.axiosInstance.delete<Vacation>(`/followers/unfollow/${vacationId}`);
        return data;
    }

    async follow(vacationId: string): Promise<Vacation> {
        const { data } = await this.axiosInstance.post<Vacation>(`/followers/follow/${vacationId}`);
        return data;
    }

}