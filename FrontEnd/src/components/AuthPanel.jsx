
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPanel.css";

export default function AuthData() {
    const navigate = useNavigate();

    const [mode, setMode] = useState("signup");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((currData) => ({
            ...currData,
            [name]: value
        }));

        setMessage("");
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setMessage("");
        setFormData({
            name: "",
            email: "",
            password: ""
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");

        const isSignup = mode === "signup";

        try {
            const response = await fetch(
                `http://localhost:9090/auth/${isSignup ? "register" : "login"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        isSignup
                            ? formData
                            : {
                                email: formData.email,
                                password: formData.password
                            }
                    )
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Authentication failed.");
                setMessageType("error");
                return;
            }

            if (isSignup) {
                setMessage("Account created successfully! Please log in.");
                setMessageType("success");
                setMode("login");

                setFormData({
                    name: "",
                    email: formData.email,
                    password: ""
                });

            } else {
                if (!data.token) {
                    setMessage("Login response did not contain a token.");
                    setMessageType("error");
                    return;
                }

                localStorage.setItem("token", data.token);

                setMessage("Login successful!");
                setMessageType("success");

                navigate("/meeting");
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to the server. Please try again.");
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-panel">

            <div className="auth-heading">
                <span className="auth-eyebrow">WELCOME TO NEXAMEET</span>

                <h1>
                    {mode === "signup"
                        ? "Create your account"
                        : "Welcome back"}
                </h1>

                <p>
                    {mode === "signup"
                        ? "Start connecting with people, anywhere."
                        : "Sign in to continue to your meetings."}
                </p>
            </div>

            <div className="auth-tabs">
                <button
                    type="button"
                    className={mode === "signup" ? "active" : ""}
                    onClick={() => handleModeChange("signup")}
                >
                    Sign Up
                </button>

                <button
                    type="button"
                    className={mode === "login" ? "active" : ""}
                    onClick={() => handleModeChange("login")}
                >
                    Log In
                </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>

                {mode === "signup" && (
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {message && (
                    <div className={`auth-message ${messageType}`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="auth-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Please wait..."
                        : mode === "signup"
                            ? "Create Account"
                            : "Sign In"}
                </button>

            </form>

            <p className="auth-footer">
                {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}

                <button
                    type="button"
                    onClick={() =>
                        handleModeChange(
                            mode === "signup" ? "login" : "signup"
                        )
                    }
                >
                    {mode === "signup" ? "Log in" : "Sign up"}
                </button>
            </p>

        </div>
    );
}
