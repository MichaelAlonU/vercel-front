import type { AxiosInstance } from "axios";
import axios from "axios";

export default abstract class AuthAware {
    axiosInstance: AxiosInstance;

    constructor(jwt: string, /*clientId: string*/) {
        this.axiosInstance = axios.create({
            baseURL: "https://p01--vacations-backend-io--dbq6h7qyvd5d.code.run",
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        });
    }
}