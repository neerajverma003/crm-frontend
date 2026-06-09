import { useState, useEffect } from "react";
import axios from "axios";
import {
  MdAdd, MdGridView, MdList, MdBusiness,
  MdCheckCircle, MdHourglassEmpty, MdSearch, MdFilterList
} from "react-icons/md";
import MyCards from "../UserManagement/MyCards.jsx";
import SearchCompanies from "./SearchCompanies.jsx";
import SearchCompanyByStatus from "./SearchCompanyByStatus.jsx";
import AddCompany from "./AddCompany.jsx";
import CompanyCard from "./CompanyCard.jsx";
import BusinessProfileCard from "./BusinessProfileCard.jsx";

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   val: "text-blue-700"   },
    green:  { bg: "bg-emerald-50", text: "text-emerald-600", val: "text-emerald-700" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  val: "text-amber-700"  },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 ${c.bg} ${c.text} rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${c.val} leading-tight mt-0.5`}>{value}</p>
      </div>
    </div>
  );
};

const MainAllCompanies = () => {
  const [view, setView] = useState("Grid");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/company/all`);
        const data = res?.data?.companies || [];
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again later.");
        setCompanies([]);
        setFilteredCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedStatus === "All Status") {
      setFilteredCompanies(companies);
    } else {
      setFilteredCompanies(
        companies.filter((c) => c.status?.toLowerCase() === selectedStatus.toLowerCase())
      );
    }
  }, [selectedStatus, companies]);

  const mapCompanyProps = (company) => ({
    companyName:       company.companyName       || "N/A",
    industry:          company.industry          || "N/A",
    status:            company.status            || "Pending",
    email:             company.email             || "N/A",
    phoneNumber:       company.phoneNumber       || "N/A",
    website:           company.website           || "N/A",
    numberOfEmployees: company.numberOfEmployees || 0,
    deals:             company.deals             || 0,
    value:             company.value             || "$0",
    logo:              company.logo              || "",
    logoKey:           company.logoKey           || "",
  });

  const activeCount  = companies.filter((c) => c.status?.toLowerCase() === "active").length;
  const pendingCount = companies.filter((c) => c.status?.toLowerCase() === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              All Companies
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and organize all your business partners
            </p>
          </div>
          <div className="shrink-0">
            <AddCompany />
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            label="Total Companies"
            value={companies.length}
            icon={<MdBusiness size={22} />}
            color="blue"
          />
          <StatCard
            label="Active"
            value={activeCount}
            icon={<MdCheckCircle size={22} />}
            color="green"
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<MdHourglassEmpty size={22} />}
            color="amber"
          />
        </div>

        {/* ── Controls Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 sm:mb-8 overflow-hidden">
          {/* Top row: always visible */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
            {/* Filter toggle (mobile) / Search (desktop) */}
            <div className="flex-1 min-w-0">
              {/* Desktop: show search inline */}
              <div className="hidden sm:block">
                <SearchCompanies />
              </div>
              {/* Mobile: show a search icon label */}
              <button
                type="button"
                onClick={() => setShowFilters((p) => !p)}
                className="sm:hidden flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl w-full touch-manipulation"
              >
                <MdSearch size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-400 truncate">Search or filter…</span>
                <MdFilterList size={18} className="text-slate-400 ml-auto shrink-0" />
              </button>
            </div>

            {/* View toggle — always visible */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setView("Grid")}
                title="Grid view"
                className={`
                  flex items-center justify-center gap-1.5
                  px-3 py-1.5 rounded-lg text-sm font-semibold
                  transition-all duration-150 touch-manipulation
                  ${view === "Grid"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"}
                `}
              >
                <MdGridView size={17} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setView("List")}
                title="List view"
                className={`
                  flex items-center justify-center gap-1.5
                  px-3 py-1.5 rounded-lg text-sm font-semibold
                  transition-all duration-150 touch-manipulation
                  ${view === "List"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"}
                `}
              >
                <MdList size={17} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Expandable filter row (mobile) / always visible (desktop) */}
          <div className={`
            border-t border-slate-100
            px-4 pb-4 pt-3 sm:px-5
            sm:block
            ${showFilters ? "block" : "hidden"}
          `}>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mobile search */}
              <div className="sm:hidden">
                <SearchCompanies />
              </div>
              <SearchCompanyByStatus onStatusChange={setSelectedStatus} />
            </div>
          </div>
        </div>

        {/* ── Hidden edit modal ── */}
        <AddCompany
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); setEditingCompany(null); }}
          initialData={editingCompany}
          onSaved={(saved) => {
            const updated = saved?._id ? saved : saved?.company || saved;
            if (updated?._id) {
              const patch = (prev) => prev.map((c) => c._id === updated._id ? { ...c, ...updated } : c);
              setCompanies(patch);
              setFilteredCompanies(patch);
            }
            setIsEditOpen(false);
            setEditingCompany(null);
          }}
        />

        {/* ── Company List / Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading companies…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <MdBusiness size={26} className="text-red-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">Something went wrong</p>
            <p className="text-sm text-slate-500 mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
            >
              Retry
            </button>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <MdBusiness size={26} className="text-indigo-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">No companies found</p>
            <p className="text-sm text-slate-500">
              {selectedStatus !== "All Status"
                ? `No results for status "${selectedStatus}"`
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div
            className={
              view === "Grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                : "flex flex-col gap-3 sm:gap-4"
            }
            role="region"
            aria-label="List of all companies"
          >
            {filteredCompanies.map((company) =>
              view === "Grid" ? (
                <CompanyCard
                  key={company._id}
                  _id={company._id}
                  {...mapCompanyProps(company)}
                  onDelete={(id) => setCompanies((prev) => prev.filter((c) => c._id !== id))}
                  onEdit={() => { setEditingCompany(company); setIsEditOpen(true); }}
                />
              ) : (
                <BusinessProfileCard
                  key={company._id}
                  _id={company._id}
                  {...mapCompanyProps(company)}
                  onDelete={(id) => setCompanies((prev) => prev.filter((c) => c._id !== id))}
                  onEdit={() => { setEditingCompany(company); setIsEditOpen(true); }}
                />
              )
            )}
          </div>
        )}

        {/* ── Footer count ── */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="mt-8 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-500 text-xs font-medium shadow-sm">
              <MdBusiness size={14} />
              Showing {filteredCompanies.length} of {companies.length} companies
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainAllCompanies;