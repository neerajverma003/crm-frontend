import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "default",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(null);
    const navigate = useNavigate();

    /* ============ TOKEN EXPIRY ============ */
    useEffect(() => {
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
            localStorage.clear();
            navigate("/");
        }
    }, [navigate]);

    /* ============ VALIDATION ============ */
    const validate = () => {
        const err = {};
        if (!formData.email) err.email = "Email is required";
        if (!formData.password) err.password = "Password is required";
        if (formData.role === "default") err.role = "Select role";
        return err;
    };

    /* ============ INPUT CHANGE ============ */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* ============ SUBMIT ============ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validate();
        setErrors(err);
        if (Object.keys(err).length) return;

        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login/login`, formData, { withCredentials: true });
            console.log(res);
            
            // if(res.status==403){
            //     toast.error("Please contact your management for access", {
            //         autoClose: 800,
            //     });
            //     setLoading(false);
            //     return;
            // }
            const { token, user } = res.data;
            const expiry = Date.now() + 12 * 60 * 60 * 1000;

            localStorage.setItem("token", token);
            localStorage.setItem("tokenExpiry", String(expiry));
            localStorage.setItem("role", user.role);
            localStorage.setItem("userId", user.id || user._id);
            localStorage.setItem("companyId", user.companyId || user.company);

            toast.success(`Login successful as ${user.role}`, {
                onClose: () => navigate("/dashboard"),
            });
        } catch (err) {
            console.error("Login error:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    toast.error(err.response.data.message || "Please contact your management for access");
                } else if (err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Invalid credentials");
                }
            } else {
                toast.error(err.message || "Network Error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (errors.email && emailRef.current) emailRef.current.focus();
    }, [errors]);

    return (
        <>
            <ToastContainer
                position="top-center"
                transition={Slide}
                autoClose={1000}
            />

            <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
                {/* ================= LEFT SECTION ================= */}
                <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-[#EAF2FF] to-[#F8FBFF] px-24 lg:flex">
                    {/* NEW LEAD CARD */}
                    {/* <div className="absolute left-20 top-20 z-10 rounded-2xl bg-white px-4 py-3 shadow-lg">
                        <p className="text-xs text-gray-400">NEW LEAD</p>
                        <p className="text-sm font-semibold">Sarah Jenkins</p>
                        <div className="mt-2 h-2 w-40 rounded-full bg-gray-200">
                            <div className="h-2 w-3/4 rounded-full bg-blue-600"></div>
                        </div>
                    </div> */}

                    {/* TRUSTED BADGE (no overlap) */}
                    {/* <div className="absolute left-24 top-40 z-0 pt-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                            Trusted by 2,000+ Enterprises
                        </span>
                    </div> */}

                    {/* MAIN CONTENT */}
                    <div className="relative z-10 mt-32">
                        <h1 className="flex flex-wrap gap-2 text-5xl font-bold leading-tight text-gray-900">
                            <span className="word word-1">Welcome</span>
                            <span className="word word-2">to</span>
                            <span className="word word-3 text-blue-600">CRM</span>
                            <span className="word word-4 text-blue-600">PRO</span>
                        </h1>

                        <p className="mt-4 max-w-md text-lg text-gray-600">
                            Manage customers, track leads, and grow your business effortlessly with our next-gen platform.
                        </p>

                        {/* MONTHLY GROWTH */}
                        <div className="mt-16 w-full rounded-2x border-none">
                            <p className="mb-2 text-xs text-black">MONTHLY GROWTH</p>
                            <div className="flex h-52 items-end gap-3 overflow-hidden">
                                <div className="animate-bar-1 w-8 rounded-md bg-blue-200" />
                                <div className="animate-bar-2 w-8 rounded-md bg-blue-200" />
                                <div className="animate-bar-3 w-8 rounded-md bg-blue-300" />
                                <div className="animate-bar-4 w-8 rounded-md bg-blue-300" />
                                <div className="animate-bar-5 w-8 rounded-md bg-blue-200" />
                                <div className="animate-bar-6 w-8 rounded-md bg-blue-300" />
                                <div className="animate-bar-7 w-8 rounded-md bg-blue-400" />
                                <div className="animate-bar-8 w-8 rounded-md bg-blue-600" />
                                <div className="animate-bar-9 w-8 rounded-md bg-blue-600" />
                                <div className="animate-bar-10 w-8 rounded-md bg-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SECTION ================= */}
                <div className="flex items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                            <p className="text-sm text-gray-500">Sign in to manage your pipeline</p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            

                            <div>
                                <label className="text-sm text-gray-700">Email Address</label>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="mt-1 w-full rounded-full border bg-gray-50 px-5 py-3"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <label>Password</label>
                                    {/* <button
                                        type="button"
                                        className="text-blue-600"
                                    >
                                        Forgot?
                                    </button> */}
                                </div>

                                <div className="relative mt-1">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="********"
                                        className="w-full rounded-full border bg-gray-50 px-5 py-3 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div>
                                <label className="text-sm text-gray-700 mt-2">Workplace Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-full border bg-gray-50 px-8 py-3"
                                >
                                    <option value="default">Select your role...</option>
                                    <option value="superAdmin">Super Admin</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            </div>

                            {/* <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" /> Remember this device
                            </label> */}

                            <button
                                disabled={loading}
                                className="w-full rounded-full bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
                            >
                                {loading ? "Signing in..." : "Sign In to Dashboard"}
                            </button>

                            {/* <p className="mt-4 text-center text-sm text-gray-500">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="font-medium text-blue-600"
                                >
                                    Create Account
                                </button>
                            </p> */}
                        </form>
                    </div>
                </div>
            </div>

            {/* ================= ANIMATIONS ================= */}
            <style>
                {`
          @keyframes grow {
            0% { height: 0; opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-bar-1 { height: 4rem; animation: grow .8s ease-out forwards; }
          .animate-bar-2 { height: 5rem; animation: grow 1s ease-out forwards; }
          .animate-bar-3 { height: 6rem; animation: grow 1.2s ease-out forwards; }
          .animate-bar-4 { height: 7rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-5 { height: 8rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-6 { height: 9rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-7 { height: 10rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-8 { height: 11rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-9 { height: 12rem; animation: grow 1.4s ease-out forwards; }
          .animate-bar-10 { height: 13rem; animation: grow 1.4s ease-out forwards; }
        `}
            </style>
        </>
    );
};

export default SignIn;