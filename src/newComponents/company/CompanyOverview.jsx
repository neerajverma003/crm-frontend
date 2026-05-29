import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, Mail, Phone, Globe, Loader, AlertCircle } from 'lucide-react';

const CompanyOverview = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/company/all`);
        const allCompanies = res?.data?.companies || [];

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
  console.log(companies);

  // ✅ Handle card click to navigate
  const handleCardClick = (company) => {
    navigate('/companies', { state: { selectedCompany: company } });
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
        </div>
        <p className="text-slate-500 font-medium mt-6">Loading organizations...</p>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 -rotate-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Empty State
  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">No Companies Found</h2>
          <p className="text-slate-500 leading-relaxed">It looks like you haven't added any companies to your network yet. Start by creating your first entity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Company Overview
            </h1>
            <p className="text-slate-500">
              Manage your network of <span className="font-semibold text-indigo-600">{companies.length}</span> active organizations
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
              <Building2 size={24} strokeWidth={2.5} />
            </div>
            <div className="pr-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Companies</p>
              <p className="text-2xl font-bold text-slate-800 leading-none">{companies.length}</p>
            </div>
          </div>
        </div>

        {/* COMPANY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => {
            const isActive = company.status?.toLowerCase() === 'active';
            const status = isActive ? 'Active' : 'Pending';
            
            return (
              <div
                key={company._id}
                onClick={() => handleCardClick(company)}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full -translate-y-0 hover:-translate-y-1"
              >
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500 ease-out opacity-60 pointer-events-none" />
                
                <div className="relative z-10 flex-1">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-bold text-xl shadow-inner overflow-hidden shrink-0 border border-slate-200/50 group-hover:shadow-md transition-shadow">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.companyName}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-semibold shadow-sm"
                          style={{ display: company.logo ? 'none' : 'flex' }}
                        >
                          {(company.companyName || 'C')[0].toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                        : 'bg-amber-50 text-amber-700 border-amber-200/60'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {status}
                    </div>
                  </div>

                  {/* Title & Industry */}
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-indigo-600 transition-colors">
                      {company.companyName || 'N/A'}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium truncate mt-0.5">
                      {company.industry || 'Industry Not Set'}
                    </p>
                  </div>

                  {/* Info List */}
                  <div className="space-y-3.5 text-sm text-slate-600">
                    {company.email && (
                      <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item">
                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors">
                          <Mail size={16} />
                        </div>
                        <span className="truncate">{company.email}</span>
                      </div>
                    )}
                    
                    {company.phoneNumber && (
                      <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item">
                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors">
                          <Phone size={16} />
                        </div>
                        <span className="truncate">{company.phoneNumber}</span>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item">
                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors">
                          <Globe size={16} />
                        </div>
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Users size={16} className="text-slate-400" />
                    <span>{company.numberOfEmployees || 0} Employees</span>
                  </div>
                  <div className="text-indigo-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 text-slate-500 text-sm font-medium">
            <Building2 size={16} />
            Showing {companies.length} companies
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
