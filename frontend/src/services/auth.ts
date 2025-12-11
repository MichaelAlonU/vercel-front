import axios from "axios";
import UserDraft from "../models/UserDraft";
import Login from "../models/LoginModel";

class AuthService {

    async signup(draft: UserDraft): Promise<{ jwt: string }> {
        console.log(import.meta.env);

        const { data } = await axios.post<{ jwt: string }>(`${import.meta.env.VITE_REST_SERVER_URL}/auth/signup`, draft);
        return data;
    }

    async login(login: Login): Promise<{ jwt: string }> {
        const { data } = await axios.post<{ jwt: string }>(`${import.meta.env.VITE_REST_SERVER_URL}/auth/login`, login);
        return data;
    }
}

const authService = new AuthService();
export default authService;