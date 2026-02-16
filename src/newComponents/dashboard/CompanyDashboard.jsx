import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CompanyDashboard() {
    const { id } = useParams(); // Company ID from URL
    const [company, setCompany] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch adminId from localStorage (key: userId)
    const adminId = localStorage.getItem("userId");

    useEffect(() => {
        if (id) fetchCompanyDetails(id);
    }, [id]);

    useEffect(() => {
        if (adminId && id) fetchRoles(adminId, id);
    }, [adminId, id]);

    const fetchCompanyDetails = async (companyId) => {
        try {
            const res = await axios.get(`http://localhost:4000/company/${companyId}`);
            console.log("Company API Response:", res.data);
            if (res.data && res.data.company) {
                setCompany(res.data.company);
            } else {
                console.error("Company not found");
                setCompany(null);
            }
        } catch (error) {
            console.error("Error fetching company:", error);
            setCompany(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async (adminId, companyId) => {
        try {
            const res = await axios.get(`http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`);
            console.log("Assigned Roles API Response:", res.data);
            if (res.data && res.data.assignedRoles) {
                setRoles(res.data.assignedRoles);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-lg text-gray-600">Loading company details...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <svg
                        className="mx-auto mb-4 h-16 w-16 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-lg font-semibold text-red-500">Company not found</p>
                    <p className="mt-2 text-gray-500">The requested company could not be loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 📌 Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Dashboard Overview</h1>
                <p className="mt-1 text-gray-500">View and manage company information</p>
            </div>

            {/* 🧩 Company Details Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-md">
                {/* Company Header */}
                <div className="bg-black px-6 py-8 text-white">
                    <h2 className="mb-2 text-3xl font-bold">{company.companyName || company.name}</h2>
                    <p className="text-blue-100">
                        Industry: <span className="font-semibold">{company.industry || "Technology"}</span>
                    </p>
                </div>

                {/* Company Information Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="font-semibold text-gray-800">{company.email || "N/A"}</p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-800">{company.phoneNumber || "N/A"}</p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Website</p>
                                <a
                                    href={company.website || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-blue-600 hover:underline"
                                >
                                    {company.website || "N/A"}
                                </a>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                                        company.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {company.status || "Active"}
                                </span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="border-l-4 border-purple-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="font-semibold text-gray-800">{company.address || "Dwarka Mor"}</p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Employees</p>
                                <p className="font-semibold text-gray-800">{company.numberOfEmployees || 30}</p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <p className="text-sm font-medium text-gray-500">Created On</p>
                                <p className="font-semibold text-gray-800">
                                    {company.createdAt
                                        ? new Date(company.createdAt).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "29/10/2025"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Roles Section */}
                    {roles.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="mb-4 text-xl font-bold text-gray-800">Assigned Roles</h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {roles.map((role, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-800"
                                    >
                                        {role.roleName || role.name || "Unknown SubRole"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompanyDashboard;
