import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const emailInputRef = useRef(null);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            emailInputRef.current.focus();
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            emailInputRef.current.focus();
            return;
        }

        setTimeout(() => {
            navigate("/reset-password");
            setEmail("");
        }, 1000);
    };

    useEffect(() => {
        if (error) {
            setError("");
        }
    }, [email]);

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            {/* Left Section */}
            <aside className="flex flex-1 flex-col items-center justify-center bg-orange-100 p-6 text-center">
                <div className="mb-4 w-full max-w-[560px] overflow-hidden rounded-lg">
                    <img
                        src="/ForgotPassword.jpg"
                        alt="Forgot Password Illustration"
                        className="h-auto w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <h2 className="text-xl font-semibold text-black">Secure Password Reset</h2>
                <p className="mt-2 text-gray-600">We'll help you regain access to your account securely</p>
            </aside>

            {/* Right Section */}
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
                    <div className="mx-auto my-8 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-[28px] font-bold text-white transition-transform duration-300 hover:scale-110">
                        C
                    </div>
                    <h1 className="mb-8 text-center text-3xl font-semibold text-gray-700">CRM Pro</h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        noValidate
                        aria-live="polite"
                    >
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-semibold text-black">Forgot Password?</h2>
                            <p className="text-gray-600">Enter your email to receive a reset link</p>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-black"
                            >
                                Enter your registered email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@company.com"
                                className={`w-full rounded-xl bg-gray-200 px-3 py-3 transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                    error ? "border border-red-500" : ""
                                }`}
                                required
                                aria-describedby="email-error"
                                aria-invalid={error ? "true" : "false"}
                                ref={emailInputRef}
                            />
                            {error && (
                                <p
                                    id="email-error"
                                    className="mt-1 text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-black py-3 text-white transition hover:scale-[102%] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            Send Reset Link
                        </button>

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-black hover:underline"
                            >
                                <ArrowLeft className="mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
