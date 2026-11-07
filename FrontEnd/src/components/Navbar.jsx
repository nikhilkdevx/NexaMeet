
import "./Navbar.css";
import NexaLogo from "../assets/Nexa-logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(Boolean(localStorage.getItem("token")));
        };

        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <div className="Navbar">
            <div className="NavImg" onClick={() => navigate("/")}>
                <img src={NexaLogo} alt="Nexa Meet Logo" />
                <h2>Nexa<span>Meet</span></h2>
            </div>

            <div className="NavTitle"></div>

            <div className="Navbarbtns">
                {isLoggedIn ? (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <>
                        <button onClick={() => navigate("/auth")}>
                            Sign Up
                        </button>

                        <button onClick={() => navigate("/auth")}>
                            Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
