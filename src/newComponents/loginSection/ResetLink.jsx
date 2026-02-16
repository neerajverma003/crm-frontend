import { ArrowLeft, Check, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetLink = () => {
    const navigate = useNavigate();

    const handleBackToLogin = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            {/* Left Section */}
            <div className="flex flex-1 flex-col items-center justify-center bg-emerald-100 p-8 text-center">
                <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                        src="/resetlink.jpg"
                        alt="Reset instructions illustration"
                        className="h-80 w-80 rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <h2 className="text-xl font-semibold text-black">Check Your Email</h2>
                <p className="mt-2 text-gray-600">We've sent you secure instructions to reset your password.</p>
            </div>

            {/* Right Section */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-black text-lg font-bold text-white">C</div>
                    <h1 className="mb-8 mt-4 text-center text-3xl font-semibold text-gray-700">CRM Pro</h1>

                    <form
                        onSubmit={handleBackToLogin}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-black">Reset Link Sent!</h2>
                            <p className="mt-2 text-gray-600">We have emailed you instructions to reset your password.</p>
                        </div>

                        <div className="flex items-start gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                            <Mail className="mt-1 h-8 w-8 text-blue-600" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium">Didn't receive the email?</p>
                                <p>Check your spam folder or contact support if you continue to have issues.</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                            Back to Login
                        </button>

                        <div className="mt-4 text-center">
                            <ArrowLeft className="mr-2 inline-block text-gray-600" />
                            <a
                                href="/forgot-password"
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Try with a different email
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetLink;
