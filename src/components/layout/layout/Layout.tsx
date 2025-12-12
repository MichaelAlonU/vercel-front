import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Main from "../main/Main";
import Login from "../../auth/login/Login";
import Signup from "../../auth/signup/Signup";

export default function Layout() {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    return (
        <div className='Layout'>
            <header><Header /></header>

            <main>
                <Routes>
                    {isLoggedIn ? (
                        <Route path="/*" element={<Main />} />
                    ) : (
                        <>
                            <Route
                                path="/login"
                                element={isLoggedIn ? <Navigate to="/vacations" replace /> : <Login />}
                            />
                            <Route path="/signup"
                                element={isLoggedIn ? <Navigate to="/vacations" replace /> : <Signup />}
                            />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </>
                    )}
                </Routes>
            </main>

            <footer><Footer /></footer>
        </div>
    );
}
