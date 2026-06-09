import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, Mail, Phone, Globe, Loader, AlertCircle, ArrowRight, Search } from 'lucide-react';

const CompanyOverview = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/company/all`);
        setCompanies(res?.data?.companies || []);
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

  const handleCardClick = (company) => {
    navigate('/companies', { state: { selectedCompany: company } });
  };

  const filtered = companies.filter((c) =>
    (c.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Loader className="w-7 h-7 text-indigo-600 animate-spin" />
          </div>
        </div>
        <p className="text-slate-500 font-medium text-sm">Loading organizations…</p>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Connection Error</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors touch-manipulation"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty ─────────────────────────────────────────────────────────────────
  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-10 border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Companies Yet</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Start by creating your first company to manage your network.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ── Header ── */}
        <div className="mb-6 sm:mb-8">
          {/* Top row: title + stat pill */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Company Overview
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage your network of{' '}
                <span className="font-semibold text-indigo-600">{companies.length}</span>{' '}
                active organizations
              </p>
            </div>

            {/* Stat pill — hidden on xs, shown sm+ */}
            <div className="hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm shrink-0">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Total
                </p>
                <p className="text-2xl font-bold text-slate-800 leading-none">
                  {companies.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or industry…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2.5
                bg-white border border-slate-200
                rounded-xl text-sm text-slate-700
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                transition-all duration-200
                shadow-sm
              "
            />
          </div>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">No companies match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((company) => {
              const isActive = company.status?.toLowerCase() === 'active';
              const initial = (company.companyName || 'C')[0].toUpperCase();

              return (
                <div
                  key={company._id}
                  onClick={() => handleCardClick(company)}
                  className="
                    group relative
                    bg-white rounded-2xl
                    border border-slate-200/70
                    shadow-sm
                    hover:shadow-lg hover:border-indigo-200
                    active:scale-[0.98]
                    transition-all duration-250
                    cursor-pointer
                    flex flex-col
                    overflow-hidden
                    touch-manipulation
                  "
                >
                  {/* Top accent bar */}
                  <div className={`h-1 w-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Logo / Initial */}
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-inner bg-slate-50">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.companyName}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-lg"
                          style={{ display: company.logo ? 'none' : 'flex' }}
                        >
                          {initial}
                        </span>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`
                          inline-flex items-center gap-1.5
                          px-2.5 py-1 rounded-full
                          text-[11px] font-semibold border
                          ${isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        {isActive ? 'Active' : 'Pending'}
                      </span>
                    </div>

                    {/* Name + industry */}
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-800 text-base sm:text-[17px] leading-snug truncate group-hover:text-indigo-600 transition-colors">
                        {company.companyName || 'Unnamed Company'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                        {company.industry || 'Industry not set'}
                      </p>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-2.5 text-xs text-slate-600 flex-1">
                      {company.email && (
                        <ContactRow icon={<Mail size={13} />} label={company.email} />
                      )}
                      {company.phoneNumber && (
                        <ContactRow icon={<Phone size={13} />} label={company.phoneNumber} />
                      )}
                      {company.website && (
                        <ContactRow icon={<Globe size={13} />} label={company.website} />
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <Users size={13} className="text-slate-400" />
                        <span>{company.numberOfEmployees || 0} employees</span>
                      </div>
                      <div className="
                        w-7 h-7 rounded-lg
                        bg-indigo-50 text-indigo-500
                        flex items-center justify-center
                        opacity-0 translate-x-1
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-200
                      ">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer count ── */}
        <div className="mt-10 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-500 text-xs font-medium shadow-sm">
            <Building2 size={13} />
            Showing {filtered.length} of {companies.length} companies
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Small helper component ─────────────────────────────────────────────────
const ContactRow = ({ icon, label }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="shrink-0 text-slate-400">{icon}</span>
    <span className="truncate text-slate-600">{label}</span>
  </div>
);

export default CompanyOverview;