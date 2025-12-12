import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import SpinnerButton from "../../common/spinner-button/SpinnerButton";
import { login } from "../../../redux/auth-slice";
import authService from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import LoginModel from "../../../models/LoginModel";
import './Login.css';

export default function Login() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginModel>();

    async function onSubmit(data: LoginModel) {
        try {

            setIsSubmitting(true);
            const { jwt } = await authService.login(data);
            localStorage.setItem("jwt", jwt);
            dispatch(login(jwt));
            navigate("/vacations");

        } catch (err: any) {
            if (err.response?.status === 401) {
                alert("invalid email or password!");
            } else {
                alert("Login failed" + err.message);
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">

                <h2>Login</h2>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email is invalid"
                            }
                        })}
                        type="email"
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 4, message: "Minimum 4 characters" }
                        })}
                        type="password"
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                <SpinnerButton
                    buttonText='Login'
                    loadingText='logging in...'
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    )
};