import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, Mail, Phone, Globe, Loader, AlertCircle } from 'lucide-react';

const EmployeeCompanyOverview = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const id = localStorage.getItem('userId');
    // ✅ Fetch all companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError('');

                const res = await axios.get(`http://localhost:4000/employee/getCompanyByEmployeeId/${id}`);
                // console.log(res);

                const companyId = res?.data?.assignedCompanies._id || [];
                // console.log(typeof(companyId));
                // const companiesArray = Array.isArray(allCompanies)
                // ? allCompanies
                // : Object.values(allCompanies);
                
                // console.log(companyId);
                const response = await axios.get(`http://localhost:4000/company/${companyId}`);
                // const companyId = res?.data?.assignedCompanies._id || [];
                const allCompanies = response?.data?.company || [];
                // console.log(companiesArray);
                setCompanies(allCompanies);
            } catch (err) {
                console.error('❌ Error fetching companies:', err);
                setError('Failed to fetch companies. Please try again.');
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    // ✅ Handle card click to navigate
    const handleCardClick = (company) => {
        navigate('/companies', { state: { selectedCompany: company } });
    };

    // ✅ Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Loading companies...</p>
                </div>
            </div>
        );
    }
    // console.log(companies);

    // ✅ Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Empty State
    if (companies.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Companies Found</h2>
                    <p className="text-gray-500">Start by creating your first company to get started.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-8">
            {/* ============================================
          HEADER SECTION
          ============================================ */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Company Overview
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Managing <span className="font-semibold text-blue-600">{companies.length}</span> companies
                        </p>
                    </div>

                    {/* Stats Card */}
                    {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg w-full md:w-fit"> */}
                        {/* <div className="flex items-center gap-4"> */}
                            {/* <div className="bg-white/20 p-3 rounded-lg">
                                <Building2 size={28} />
                            </div> */}
                            {/* <div>
                                <p className="text-white/80 text-sm">Total Companies</p>
                                <p className="text-3xl font-bold">{companies.length}</p>
                            </div> */}
                        {/* </div> */}
                    {/* </div> */}
                </div>

                {/* ============================================
            COMPANY CARDS GRID
            ============================================ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* {companies.map((company) => { */}
                        {/* const status = company.status?.toLowerCase() === 'active' ? 'Active' : 'Pending';
                        const statusColor = status === 'Active'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'; */}

                        {/* return ( */}
                            <div
                                key={companies._id}
                                onClick={() => handleCardClick(company)}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {(companies.companyName || 'C')[0].toUpperCase()}
                                        </div>

                                        {/* Company Name & Industry */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors">
                                                {companies.companyName || 'N/A'}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {companies.industry || 'Industry Not Set'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ml-2 ${statusColor}`}>
                                        {status}
                                    </span> */}
                                </div>

                                {/* Divider */}
                                <hr className="my-4 border-gray-200" />

                                {/* Contact Information */}
                                <div className="space-y-3 text-sm text-gray-700 mb-4">
                                    {/* Email */}
                                    {companies.email && (
                                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                            <Mail size={16} className="text-blue-500 flex-shrink-0" />
                                            <span className="truncate">{companies.email}</span>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {companies.phoneNumber && (
                                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                            <Phone size={16} className="text-green-500 flex-shrink-0" />
                                            <span className="truncate">{companies.phoneNumber}</span>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {companies.website && (
                                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                            <Globe size={16} className="text-purple-500 flex-shrink-0" />
                                            <span className="truncate">{companies.website}</span>
                                        </div>
                                    )}

                                    {/* Employees */}
                                    {companies.numberOfEmployees && (
                                        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                            <Users size={16} className="text-orange-500 flex-shrink-0" />
                                            <span>{companies.numberOfEmployees} employees</span>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <hr className="my-4 border-gray-200" />

                                {/* Footer - Click to View */}
                                {/* <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95">
                  View Details →
                </button> */}
                            </div>
                        {/* ); */}
                    {/* })} */}
                </div>

                {/* ============================================
            FOOTER INFO
            ============================================ */}
                {/* Total Companies */}
            </div>
        </div>
    );
};

export default EmployeeCompanyOverview;
