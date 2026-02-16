
// import { useState, useEffect } from "react";
// import axios from "axios";
// import MyCards from "../UserManagement/MyCards.jsx";
// import SearchCompanies from "./SearchCompanies.jsx";
// import SearchCompanyByStatus from "./SearchCompanyByStatus.jsx";
// import AddCompany from "./AddCompany.jsx";
// import CompanyCard from "./CompanyCard.jsx";
// import BusinessProfileCard from "./BusinessProfileCard.jsx";

// const MainAllCompanies = () => {
//   const [view, setView] = useState("Grid");
//   const [companies, setCompanies] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("All Status");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editingCompany, setEditingCompany] = useState(null);

//   // ✅ Fetch companies from API
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await axios.get("http://localhost:4000/company/all");
//         const data = res?.data?.companies || [];
//         setCompanies(data);
//         setFilteredCompanies(data); // initial list
//       } catch (err) {
//         console.error("Error fetching companies:", err);
//         setError("Failed to fetch companies. Please try again later.");
//         setCompanies([]);
//         setFilteredCompanies([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // ✅ Filter companies whenever status changes
//   useEffect(() => {
//     if (selectedStatus === "All Status") {
//       setFilteredCompanies(companies);
//     } else {
//       const filtered = companies.filter(
//         (c) => c.status?.toLowerCase() === selectedStatus.toLowerCase()
//       );
//       setFilteredCompanies(filtered);
//     }
//   }, [selectedStatus, companies]);

//   // ✅ Helper for CompanyCard props
//   const mapCompanyProps = (company) => ({
//     companyName: company.companyName || "N/A",
//     industry: company.industry || "N/A",
//     status: company.status || "Pending",
//     email: company.email || "N/A",
//     phoneNumber: company.phoneNumber || "N/A",
//     website: company.website || "N/A",
//     numberOfEmployees: company.numberOfEmployees || 0,
//     deals: company.deals || 0,
//     value: company.value || "$0",
//     logo: company.logo || "",
//   });

//   return (
//     <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8">
//       {/* Dashboard Summary Cards */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <MyCards />
//       </div>

//       {/* Search and View Controls */}
//       <div className="my-4 flex w-full justify-between items-center">
//         <div className="flex gap-3">
//           <SearchCompanies aria-label="Search companies by name" />
//           {/* ✅ Hook up filter here */}
//           <SearchCompanyByStatus onStatusChange={setSelectedStatus} />
//         </div>

//         <div className="flex gap-1">
//           <button
//             type="button"
//             onClick={() => setView("Grid")}
//             className={`w-fit px-3 py-2 rounded-md ${
//               view === "Grid" ? "bg-black text-white" : "border border-gray-200"
//             }`}
//           >
//             Grid
//           </button>

//           <button
//             type="button"
//             onClick={() => setView("List")}
//             className={`w-fit px-3 py-2 rounded-md ${
//               view === "List" ? "bg-black text-white" : "border border-gray-200"
//             }`}
//           >
//             List
//           </button>

//           <AddCompany />
//           {/* Controlled AddCompany used for editing existing companies */}
//           <AddCompany
//             isOpen={isEditOpen}
//             onClose={() => {
//               setIsEditOpen(false);
//               setEditingCompany(null);
//             }}
//             initialData={editingCompany}
//             onSaved={(saved) => {
//               // Update companies list after edit
//               const updated = saved && saved._id ? saved : saved.company || saved;
//               if (updated && updated._id) {
//                 setCompanies((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
//                 setFilteredCompanies((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
//               }
//               setIsEditOpen(false);
//               setEditingCompany(null);
//             }}
//           />
//         </div>
//       </div>

//       {/* Companies List */}
//       <div
//         className={`border border-gray-200 rounded-md bg-[#ffffff] p-4 ${
//           view === "Grid"
//             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//             : "flex flex-col gap-4"
//         }`}
//         role="region"
//         aria-label="List of all companies"
//       >
//         {loading ? (
//           <p className="text-center text-gray-500">Loading companies...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : filteredCompanies.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No companies found for “{selectedStatus}”
//           </p>
//         ) : (
//               filteredCompanies.map((company) =>
//             view === "Grid" ? (
//               <CompanyCard
//                 key={company._id}
//                 _id={company._id}
//                 {...mapCompanyProps(company)}
//                     onDelete={(deletedId) => setCompanies((prev) => prev.filter((c) => c._id !== deletedId))}
//                     onEdit={(data) => {
//                       setEditingCompany(company);
//                       setIsEditOpen(true);
//                     }}
//               />
//             ) : (
//               <BusinessProfileCard
//                 key={company._id}
//                 _id={company._id}
//                 {...mapCompanyProps(company)}
//                     onDelete={(deletedId) => setCompanies((prev) => prev.filter((c) => c._id !== deletedId))}
//                     onEdit={(data) => {
//                       setEditingCompany(company);
//                       setIsEditOpen(true);
//                     }}
//               />
//             )
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainAllCompanies;


import { useState, useEffect } from "react";
import axios from "axios";
import { MdAdd, MdGridView, MdList } from "react-icons/md";
import MyCards from "../UserManagement/MyCards.jsx";
import SearchCompanies from "./SearchCompanies.jsx";
import SearchCompanyByStatus from "./SearchCompanyByStatus.jsx";
import AddCompany from "./AddCompany.jsx";
import CompanyCard from "./CompanyCard.jsx";
import BusinessProfileCard from "./BusinessProfileCard.jsx";

const MainAllCompanies = () => {
  const [view, setView] = useState("Grid");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // ✅ Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:4000/company/all");
        const data = res?.data?.companies || [];
        setCompanies(data);
        setFilteredCompanies(data); // initial list
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

  // ✅ Filter companies whenever status changes
  useEffect(() => {
    if (selectedStatus === "All Status") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (c) => c.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredCompanies(filtered);
    }
  }, [selectedStatus, companies]);

  // ✅ Helper for CompanyCard props
  const mapCompanyProps = (company) => ({
    companyName: company.companyName || "N/A",
    industry: company.industry || "N/A",
    status: company.status || "Pending",
    email: company.email || "N/A",
    phoneNumber: company.phoneNumber || "N/A",
    website: company.website || "N/A",
    numberOfEmployees: company.numberOfEmployees || 0,
    deals: company.deals || 0,
    value: company.value || "$0",
    logo: company.logo || "",
  });

  const activeCount = companies.filter((c) => c.status?.toLowerCase() === "active").length;
  const pendingCount = companies.filter((c) => c.status?.toLowerCase() === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Companies</h1>
            <p className="text-gray-600">Manage and organize all your business partners</p>
          </div>
          <AddCompany />
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <MyCards />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Companies</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{companies.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <SearchCompanies aria-label="Search companies by name" />
            <SearchCompanyByStatus onStatusChange={setSelectedStatus} />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setView("Grid")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                view === "Grid"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MdGridView size={18} />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setView("List")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                view === "List"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MdList size={18} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controlled AddCompany used for editing existing companies */}
      <AddCompany
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingCompany(null);
        }}
        initialData={editingCompany}
        onSaved={(saved) => {
          // Update companies list after edit
          const updated = saved && saved._id ? saved : saved.company || saved;
          if (updated && updated._id) {
            setCompanies((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
            setFilteredCompanies((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
          }
          setIsEditOpen(false);
          setEditingCompany(null);
        }}
      />

      {/* Companies List */}
      <div
        className={`border border-gray-200 rounded-md bg-[#ffffff] p-4 ${
          view === "Grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        }`}
        role="region"
        aria-label="List of all companies"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading companies...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-500">
            No companies found for “{selectedStatus}”
          </p>
        ) : (
              filteredCompanies.map((company) =>
            view === "Grid" ? (
              <CompanyCard
                key={company._id}
                _id={company._id}
                {...mapCompanyProps(company)}
                    onDelete={(deletedId) => setCompanies((prev) => prev.filter((c) => c._id !== deletedId))}
                    onEdit={(data) => {
                      setEditingCompany(company);
                      setIsEditOpen(true);
                    }}
              />
            ) : (
              <BusinessProfileCard
                key={company._id}
                _id={company._id}
                {...mapCompanyProps(company)}
                    onDelete={(deletedId) => setCompanies((prev) => prev.filter((c) => c._id !== deletedId))}
                    onEdit={(data) => {
                      setEditingCompany(company);
                      setIsEditOpen(true);
                    }}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default MainAllCompanies;