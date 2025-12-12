import axios from "axios";
import UserDraft from "../models/UserDraft";
import Login from "../models/LoginModel";

class AuthService {

    async signup(draft: UserDraft): Promise<{ jwt: string }> {
        console.log(`https://p01--vacations-backend-io--dbq6h7qyvd5d.code.run`);

        const { data } = await axios.post<{ jwt: string }>(`https://p01--vacations-backend-io--dbq6h7qyvd5d.code.run/auth/signup`, draft);
        return data;
    }

    async login(login: Login): Promise<{ jwt: string }> {
        const { data } = await axios.post<{ jwt: string }>(`https://p01--vacations-backend-io--dbq6h7qyvd5d.code.run/auth/login`, login);
        return data;
    }
}

const authService = new AuthService();
export default authService;