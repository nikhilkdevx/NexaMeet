
import { useState } from "react";
import "./AuthPanel.css";

export default function AuthData() {
    const [mode, setMode] = useState("signup");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((currData) => ({
            ...currData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const isSignup = mode === "signup";

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
            console.log(data);

            if (!response.ok) {
                console.error(data.message || "Authentication failed");
                return;
            }

            if (!isSignup) {
                localStorage.setItem("token", data.token);
            }

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch (err) {
            console.error("Authentication error:", err);
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
                    onClick={() => setMode("signup")}
                >
                    Sign Up
                </button>

                <button
                    type="button"
                    className={mode === "login" ? "active" : ""}
                    onClick={() => setMode("login")}
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

                <button type="submit" className="auth-submit">
                    {mode === "signup" ? "Create Account" : "Sign In"}
                    <span>→</span>
                </button>
            </form>

            <p className="auth-footer">
                {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}

                <button
                    type="button"
                    onClick={() =>
                        setMode(mode === "signup" ? "login" : "signup")
                    }
                >
                    {mode === "signup" ? "Log in" : "Sign up"}
                </button>
            </p>
        </div>
    );
}
