
// import { useState, useEffect } from "react";
// import { Eye, Edit2, Trash2, X } from "lucide-react";
// import EditUser from "./EditUser";
// import EditAdmin from "./EditAdmin";

// const API_URL = "http://localhost:4000";

// const UserTable = ({ onlyAdmins = false }) => {
//     const [users, setUsers] = useState([]);
//     const [companies, setCompanies] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [viewingUser, setViewingUser] = useState(null);

//     const userRole = localStorage.getItem("role");

//     // Fetch Companies
//     const fetchCompanies = async () => {
//         const res = await fetch(`${API_URL}/company/all`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
//         return data.companies || [];
//     };

//     // Fetch all data together
//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const role = localStorage.getItem("role");
//             let combined = [];

//             if (onlyAdmins) {
//                 const adminRes = await fetch(`${API_URL}/getAdmins`);
//                 const adminData = await adminRes.json();
//                 if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//                 // adminData may be an array or an object
//                 combined = adminData.admins || adminData || [];
//             } else if (role === "superAdmin") {
//                 const [adminRes, employeeRes] = await Promise.all([fetch(`${API_URL}/getAdmins`), fetch(`${API_URL}/employee/allEmployee`)]);

//                 const adminData = await adminRes.json();
//                 const employeeData = await employeeRes.json();
//                 if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//                 if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//                 const admins = adminData.admins || adminData || [];
//                 const employees = employeeData.employees || employeeData || [];

//                 combined = [...admins, ...employees];
//             } else if (role === "admin") {
//                 const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
//                 const employeeData = await employeeRes.json();
//                 if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//                 const employees = employeeData.employees || employeeData || [];
//                 combined = [...employees];
//             } else {
//                 combined = [];
//             }

//             // Attach company names
//             const usersWithCompanies = await Promise.all(
//                 combined.map(async (user) => {
//                     let companyName = user.companyName || "—";

//                     if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//                         try {
//                             const firstCompanyRes = await fetch(`${API_URL}/company/${user.company[0]}`);
//                             const firstCompanyData = await firstCompanyRes.json();
//                             companyName =
//                                 user.company.length > 1
//                                     ? `${firstCompanyData.company?.companyName || "Unknown"} +${user.company.length - 1}`
//                                     : firstCompanyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     } else if (user.company && typeof user.company === "object" && user.company._id) {
//                         try {
//                             const companyRes = await fetch(`${API_URL}/company/${user.company._id}`);
//                             const companyData = await companyRes.json();
//                             companyName = companyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     } else if (user.company && typeof user.company === "string") {
//                         try {
//                             const companyRes = await fetch(`${API_URL}/company/${user.company}`);
//                             const companyData = await companyRes.json();
//                             companyName = companyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     }

//                     return { ...user, displayCompanyName: companyName };
//                 }),
//             );

//             usersWithCompanies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//             setUsers(usersWithCompanies);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Failed to fetch users or admins. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete User
//     const deleteUser = async (id, role) => {
//         const userRole = localStorage.getItem("role")?.toLowerCase();
//         if (userRole !== "superadmin") {
//             alert("Only superAdmin can delete users.");
//             return;
//         }
//         if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;

//         try {
//             let endpoint;
//             if (role === "admin") endpoint = `${API_URL}/deleteAdmin/${id}`;
//             else if (role === "employee") endpoint = `${API_URL}/employee/deleteEmployee/${id}`;
//             else if (role === "superadmin") {
//                 alert("You cannot delete another superAdmin.");
//                 return;
//             } else throw new Error("Invalid role specified.");

//             const res = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || `Failed to delete ${role}`);

//             alert(`${role} deleted successfully`);
//             fetchData();
//         } catch (error) {
//             console.error(`❌ Error deleting:`, error);
//             alert(error.message);
//         }
//     };

//     // Edit
//     const handleEditClick = (user) => {
//         if (user.role === "Admin" && userRole !== "superAdmin") {
//             alert("You don't have permission to edit admins.");
//             return;
//         }
//         setEditingUser(user);
//         if (user.role === "Admin") setIsAdminEditOpen(true);
//         else setIsEditModalOpen(true);
//     };

//     // View
//     const handleViewClick = async (user) => {
//         try {
//             let companyNames = [];

//             if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//                 const companyPromises = user.company.map(async (companyId) => {
//                     try {
//                         const res = await fetch(`${API_URL}/company/${companyId}`);
//                         if (!res.ok) return "Unknown";
//                         const data = await res.json();
//                         return data.company?.companyName || "Unknown";
//                     } catch {
//                         return "Unknown";
//                     }
//                 });
//                 companyNames = await Promise.all(companyPromises);
//             } else if (user.companyName) companyNames = [user.companyName];
//             else if (user.company && typeof user.company === "object" && user.company._id) {
//                 try {
//                     const res = await fetch(`${API_URL}/company/${user.company._id}`);
//                     if (!res.ok) throw new Error("Failed to fetch company");
//                     const data = await res.json();
//                     companyNames = [data.company?.companyName || "Unknown"];
//                 } catch {
//                     companyNames = ["Unknown"];
//                 }
//             } else if (user.company && typeof user.company === "string") {
//                 try {
//                     const res = await fetch(`${API_URL}/company/${user.company}`);
//                     const data = await res.json();
//                     companyNames = [data.company?.companyName || "Unknown"];
//                 } catch {
//                     companyNames = ["Unknown"];
//                 }
//             }

//             setViewingUser({ ...user, companyNames });
//             setIsViewModalOpen(true);
//         } catch (error) {
//             console.error("Error fetching companies:", error);
//             setViewingUser({ ...user, companyNames: ["Unknown"] });
//             setIsViewModalOpen(true);
//         }
//     };

//     const handleCloseViewModal = () => {
//         setIsViewModalOpen(false);
//         setViewingUser(null);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditingUser(null);
//     };

//     const handleSaveUser = (updatedUser) => {
//         fetchData();
//     };

//     useEffect(() => {
//         fetchData();
//         fetchCompanies().then(setCompanies);
//     }, []);

//     const getRoleBadge = (role) => {
//         const colors = {
//             Admin: "bg-purple-100 text-purple-700",
//             Manager: "bg-[#2b7fff]",
//             "Sales Rep": "bg-[#00c951]",
//             Employee: "bg-blue-100 text-blue-700",
//         };
//         return <span className={`rounded-md px-2 py-1 text-xs font-medium ${colors[role]}`}>{role}</span>;
//     };

//     const getStatusBadge = (status) => (
//         <span className={`rounded-md px-2 py-1 text-xs font-medium text-white ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}>{status}</span>
//     );

//     return (
//         <>
//             <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6">
//                 <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md">
//                     <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4">
//                         <h2 className="text-lg font-semibold text-blue-900">
//                             {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
//                         </h2>
//                     </div>

//                     {/* ================= MOBILE VIEW ================= */}
//                     {!loading && !error && users.length > 0 && (
//                         <div className="space-y-4 p-3 sm:hidden">
//                             {users.map((u) => (
//                                 <div
//                                     key={u._id}
//                                     className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"
//                                 >
//                                     {/* Header */}
//                                     <div className="flex flex-col gap-2">
//                                         <div className="flex min-w-0 items-center gap-3">
//                                             {/* BLUE ICON */}
//                                             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
//                                                 {u.fullName?.[0]?.toUpperCase() || "?"}
//                                             </div>

//                                             <div className="min-w-0">
//                                                 <p className="truncate font-semibold text-gray-800">{u.fullName}</p>
//                                                 <p className="max-w-[220px] truncate text-xs text-gray-500">{u.email}</p>
//                                             </div>
//                                         </div>

//                                         {/* Status on new line to prevent overlap */}
//                                         <div className="flex justify-start">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</div>
//                                     </div>

//                                     {/* Details */}
//                                     <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
//                                         <div>
//                                             <span className="font-medium">Role:</span> {u.role}
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Dept:</span>{" "}
//                                             {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                                         </div>
//                                         <div className="col-span-2">
//                                             <span className="font-medium">Company:</span> {u.displayCompanyName || "—"}
//                                         </div>
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="mt-4 flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleViewClick(u)}
//                                             className="rounded-full bg-blue-100 p-2 text-blue-600"
//                                         >
//                                             <Eye size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleEditClick(u)}
//                                             className="rounded-full bg-blue-100 p-2 text-blue-600"
//                                         >
//                                             <Edit2 size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => deleteUser(u._id, u.role)}
//                                             className="rounded-full bg-red-100 p-2 text-red-600"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* ================= DESKTOP VIEW ================= */}
//                     <div className="hidden overflow-x-auto sm:block">
//                         {loading ? (
//                             <div className="py-8 text-center font-medium text-blue-600">Loading data...</div>
//                         ) : error ? (
//                             <div className="py-8 text-center text-red-500">{error}</div>
//                         ) : users.length === 0 ? (
//                             <div className="py-8 text-center text-gray-500">No records found.</div>
//                         ) : (
//                             <table className="w-full min-w-[900px] text-sm">
//                                 <thead className="border-b border-blue-200 bg-blue-50">
//                                     <tr className="text-left font-semibold text-blue-800">
//                                         <th className="p-3">User</th>
//                                         <th className="hidden p-3 sm:table-cell">Contact</th>
//                                         <th className="p-3">Role</th>
//                                         <th className="hidden p-3 md:table-cell">Department</th>
//                                         <th className="hidden p-3 lg:table-cell">Company</th>
//                                         <th className="p-3">Status</th>
//                                         <th className="hidden p-3 md:table-cell">Join Date</th>
//                                         <th className="p-3">Actions</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {users.map((u) => (
//                                         <tr
//                                             key={u._id}
//                                             className="border-b border-gray-100 transition-colors hover:bg-blue-50"
//                                         >
//                                             <td className="p-3">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
//                                                         {u.fullName.charAt(0).toUpperCase()}
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm font-semibold text-gray-800">{u.fullName}</p>
//                                                         <p className="text-xs text-gray-500">{u.email}</p>
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             <td className="hidden p-3 text-gray-600 sm:table-cell">
//                                                 {/* <div className="max-w-[180px] truncate">{u.email || "—"}</div> */}
//                                                 <div className="truncate">{u.phone || "—"}</div>
//                                             </td>

//                                             <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

//                                             <td className="hidden p-3 text-gray-700 md:table-cell">
//                                                 {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                                             </td>

//                                             <td className="hidden p-3 text-gray-700 lg:table-cell">{u.displayCompanyName || "—"}</td>

//                                             <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

//                                             <td className="hidden whitespace-nowrap p-3 text-gray-600 md:table-cell">
//                                                 {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
//                                             </td>

//                                             <td className="p-3">
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => handleViewClick(u)}
//                                                         className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                                     >
//                                                         <Eye size={16} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleEditClick(u)}
//                                                         className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                                     >
//                                                         <Edit2 size={16} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => deleteUser(u._id, u.role)}
//                                                         className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
//                                                     >
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ================= VIEW MODAL ================= */}
//             {isViewModalOpen && viewingUser && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/20 p-4 backdrop-blur-sm">
//                     <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white shadow-xl">
//                         <div className="flex items-center justify-between border-b bg-blue-50 p-6">
//                             <h2 className="text-lg font-semibold text-blue-900">User Details</h2>
//                             <button
//                                 onClick={handleCloseViewModal}
//                                 className="text-blue-500 hover:text-blue-700"
//                             >
//                                 <X size={22} />
//                             </button>
//                         </div>

//                         <div className="space-y-2 p-6 text-sm text-gray-700">
//                             <p>
//                                 <strong>Name:</strong> {viewingUser.fullName}
//                             </p>
//                             <p>
//                                 <strong>Email:</strong> {viewingUser.email}
//                             </p>
//                             <p>
//                                 <strong>Phone:</strong> {viewingUser.phone}
//                             </p>
//                             <p>
//                                 <strong>Department:</strong>{" "}
//                                 {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}
//                             </p>
//                             <p>
//                                 <strong>Company:</strong> {viewingUser.companyNames?.join(", ") || "—"}
//                             </p>
//                             <p>
//                                 <strong>Role:</strong> {viewingUser.role}
//                             </p>
//                             <p>
//                                 <strong>Salary:</strong> {viewingUser.salary ? `₹${viewingUser.salary.toLocaleString()}` : "—"}
//                             </p>
//                             <p>
//                                 <strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ================= EDIT MODALS ================= */}
//             {isEditModalOpen && editingUser && (
//                 <EditUser
//                     user={editingUser}
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveUser}
//                 />
//             )}

//             {isAdminEditOpen && editingUser && (
//                 <EditAdmin
//                     user={editingUser}
//                     isOpen={isAdminEditOpen}
//                     onClose={() => {
//                         setIsAdminEditOpen(false);
//                         setEditingUser(null);
//                     }}
//                     onSave={(updated) => {
//                         setIsAdminEditOpen(false);
//                         setEditingUser(null);
//                         handleSaveUser(updated);
//                     }}
//                 />
//             )}
//         </>
//     );
// };

// export default UserTable;

// import { useState, useEffect } from "react";
// import { Eye, Edit2, Trash2, X } from "lucide-react";
// import EditUser from "./EditUser";
// import EditAdmin from "./EditAdmin";

// const API_URL = "http://localhost:4000";

// const UserTable = ({ onlyAdmins = false, searchTerm, roleFilter }) => {
//     const [users, setUsers] = useState([]);
//     const [companies, setCompanies] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [viewingUser, setViewingUser] = useState(null);

//     const userRole = localStorage.getItem("role");

//     const normalizeRole = (role) => role?.toLowerCase();


//     // Fetch Companies
//     const fetchCompanies = async () => {
//         const res = await fetch(`${API_URL}/company/all`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
//         return data.companies || [];
//     };

//     // Fetch all data together
//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const role = localStorage.getItem("role");
//             let combined = [];

//             if (onlyAdmins) {
//                 const adminRes = await fetch(`${API_URL}/getAdmins`);
//                 const adminData = await adminRes.json();
//                 if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//                 combined = adminData.admins || adminData || [];
//             } else if (role === "superAdmin") {
//                 const [adminRes, employeeRes] = await Promise.all([fetch(`${API_URL}/getAdmins`), fetch(`${API_URL}/employee/allEmployee`)]);

//                 const adminData = await adminRes.json();
//                 const employeeData = await employeeRes.json();
//                 if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//                 if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//                 const admins = adminData.admins || adminData || [];
//                 const employees = employeeData.employees || employeeData || [];

//                 combined = [...admins, ...employees];
//             } else if (role === "admin") {
//                 const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
//                 const employeeData = await employeeRes.json();
//                 if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//                 const employees = employeeData.employees || employeeData || [];
//                 combined = [...employees];
//             } else {
//                 combined = [];
//             }

//             // Attach company names
//             const usersWithCompanies = await Promise.all(
//                 combined.map(async (user) => {
//                     let companyName = user.companyName || "—";

//                     if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//                         try {
//                             const firstCompanyRes = await fetch(`${API_URL}/company/${user.company[0]}`);
//                             const firstCompanyData = await firstCompanyRes.json();
//                             companyName =
//                                 user.company.length > 1
//                                     ? `${firstCompanyData.company?.companyName || "Unknown"} +${user.company.length - 1}`
//                                     : firstCompanyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     } else if (user.company && typeof user.company === "object" && user.company._id) {
//                         try {
//                             const companyRes = await fetch(`${API_URL}/company/${user.company._id}`);
//                             const companyData = await companyRes.json();
//                             companyName = companyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     } else if (user.company && typeof user.company === "string") {
//                         try {
//                             const companyRes = await fetch(`${API_URL}/company/${user.company}`);
//                             const companyData = await companyRes.json();
//                             companyName = companyData.company?.companyName || "Unknown";
//                         } catch {
//                             companyName = "Unknown";
//                         }
//                     }

//                     return { ...user, displayCompanyName: companyName };
//                 }),
//             );

//             usersWithCompanies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//             // setUsers(usersWithCompanies);
//             let filteredUsers = usersWithCompanies;
//             console.log(roleFilter);
            
//             if (roleFilter && roleFilter == "All Roles") {
//                 // filteredUsers = filteredUsers.filter(
//                 // (user) => normalizeRole(user.role || "employee") === normalizeRole(roleFilter)
//                 setUsers(filteredUsers);
//                 // );
//             }
//             // Role filter
//             if (roleFilter && roleFilter !== "All Roles") {
//                 filteredUsers = filteredUsers.filter(
//                     (user) => normalizeRole(user.role || "employee") === normalizeRole(roleFilter)
//                 );
//             }

//             // Search filter (optional but recommended)
//             if (searchTerm) {
//                 filteredUsers = filteredUsers.filter(
//                     (user) =>
//                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         user.displayCompanyName?.toLowerCase().includes(searchTerm.toLowerCase())
//                 );
//             }

//             setUsers(filteredUsers);

//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Failed to fetch users or admins. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete User
//     const deleteUser = async (id, role) => {
//         const userRole = localStorage.getItem("role")?.toLowerCase();
//         if (userRole !== "superadmin") {
//             alert("Only superAdmin can delete users.");
//             return;
//         }
//         if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;

//         try {
//             let endpoint;
//             if (role === "admin") endpoint = `${API_URL}/deleteAdmin/${id}`;
//             else if (role === "employee") endpoint = `${API_URL}/employee/deleteEmployee/${id}`;
//             else if (role === "superadmin") {
//                 alert("You cannot delete another superAdmin.");
//                 return;
//             } else throw new Error("Invalid role specified.");

//             const res = await fetch(endpoint, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || `Failed to delete ${role}`);

//             alert(`${role} deleted successfully`);
//             fetchData();
//         } catch (error) {
//             console.error(`❌ Error deleting:`, error);
//             alert(error.message);
//         }
//     };

//     // Edit
//     const handleEditClick = (user) => {
//         if (user.role === "Admin" && userRole !== "superAdmin") {
//             alert("You don't have permission to edit admins.");
//             return;
//         }
//         setEditingUser(user);
//         if (user.role === "Admin") setIsAdminEditOpen(true);
//         else setIsEditModalOpen(true);
//     };

//     // View
//     const handleViewClick = async (user) => {
//         try {
//             let companyNames = [];

//             if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//                 const companyPromises = user.company.map(async (companyId) => {
//                     try {
//                         const res = await fetch(`${API_URL}/company/${companyId}`);
//                         if (!res.ok) return "Unknown";
//                         const data = await res.json();
//                         return data.company?.companyName || "Unknown";
//                     } catch {
//                         return "Unknown";
//                     }
//                 });
//                 companyNames = await Promise.all(companyPromises);
//             } else if (user.companyName) companyNames = [user.companyName];
//             else if (user.company && typeof user.company === "object" && user.company._id) {
//                 try {
//                     const res = await fetch(`${API_URL}/company/${user.company._id}`);
//                     if (!res.ok) throw new Error("Failed to fetch company");
//                     const data = await res.json();
//                     companyNames = [data.company?.companyName || "Unknown"];
//                 } catch {
//                     companyNames = ["Unknown"];
//                 }
//             } else if (user.company && typeof user.company === "string") {
//                 try {
//                     const res = await fetch(`${API_URL}/company/${user.company}`);
//                     const data = await res.json();
//                     companyNames = [data.company?.companyName || "Unknown"];
//                 } catch {
//                     companyNames = ["Unknown"];
//                 }
//             }

//             setViewingUser({ ...user, companyNames });
//             setIsViewModalOpen(true);
//         } catch (error) {
//             console.error("Error fetching companies:", error);
//             setViewingUser({ ...user, companyNames: ["Unknown"] });
//             setIsViewModalOpen(true);
//         }
//     };

//     const handleCloseViewModal = () => {
//         setIsViewModalOpen(false);
//         setViewingUser(null);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditingUser(null);
//     };

//     const handleSaveUser = (updatedUser) => {
//         fetchData();
//     };

//     useEffect(() => {
//         fetchData();
//         fetchCompanies().then(setCompanies);
//     }, []);

//     const getRoleBadge = (role) => {
//         const colors = {
//             Admin: "bg-purple-100 text-purple-700",
//             Manager: "bg-[#2b7fff] text-white",
//             "Sales Rep": "bg-[#00c951] text-white",
//             Employee: "bg-blue-100 text-blue-700",
//         };
//         return (
//             <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colors[role] || "bg-gray-100 text-gray-700"}`}>
//                 {role}
//             </span>
//         );
//     };

//     const getStatusBadge = (status) => (
//         <span
//             className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ${status === "Active" ? "bg-green-500" : "bg-red-500"
//                 }`}
//         >
//             {status}
//         </span>
//     );
//     useEffect(() => {
//         fetchData();
//     }, [roleFilter, searchTerm]);

//     return (
//         <>
//             <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6">
//                 <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md">
//                     <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4">
//                         <h2 className="text-base font-semibold text-blue-900 sm:text-lg">
//                             {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
//                         </h2>
//                     </div>

//                     {/* ================= MOBILE VIEW (XS–SM) ================= */}
//                     {!loading && !error && users.length > 0 && (
//                         <div className="space-y-3 p-3 sm:hidden">
//                             {users.map((u) => (
//                                 <div
//                                     key={u._id}
//                                     className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm"
//                                 >
//                                     {/* Header */}
//                                     <div className="flex flex-col gap-2">
//                                         <div className="flex min-w-0 items-center gap-3">
//                                             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
//                                                 {u.fullName?.[0]?.toUpperCase() || "?"}
//                                             </div>

//                                             <div className="min-w-0">
//                                                 <p className="truncate text-sm font-semibold text-gray-800">{u.fullName}</p>
//                                                 <p className="max-w-[220px] truncate text-xs text-gray-500">{u.email}</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex flex-wrap items-center justify-between gap-2">
//                                             <div>{getRoleBadge(u.role || "Employee")}</div>
//                                             <div>{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</div>
//                                         </div>
//                                     </div>

//                                     {/* Details */}
//                                     <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:text-sm">
//                                         <div>
//                                             <span className="font-medium">Dept:</span>{" "}
//                                             {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Phone:</span> {u.phone || "—"}
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Company:</span> {u.displayCompanyName || "—"}
//                                         </div>
//                                         <div>
//                                             <span className="font-medium">Joined:</span>{" "}
//                                             {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
//                                         </div>
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="mt-3 flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleViewClick(u)}
//                                             className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                         >
//                                             <Eye size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleEditClick(u)}
//                                             className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                         >
//                                             <Edit2 size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => deleteUser(u._id, u.role)}
//                                             className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* ================= DESKTOP/TABLET VIEW (≥ SM) ================= */}
//                     <div className="hidden sm:block">
//                         {loading ? (
//                             <div className="py-8 text-center text-sm font-medium text-blue-600 sm:text-base">Loading data...</div>
//                         ) : error ? (
//                             <div className="px-3 py-8 text-center text-sm text-red-500 sm:text-base">{error}</div>
//                         ) : users.length === 0 ? (
//                             <div className="py-8 text-center text-sm text-gray-500 sm:text-base">No records found.</div>
//                         ) : (
//                             <div className="w-full overflow-x-auto">
//                                 <table className="w-full min-w-[900px] text-sm">
//                                     <thead className="border-b border-blue-200 bg-blue-50">
//                                         <tr className="text-left font-semibold text-blue-800">
//                                             <th className="p-3">User</th>
//                                             <th className="hidden p-3 sm:table-cell">Contact</th>
//                                             <th className="p-3">Role</th>
//                                             <th className="hidden p-3 md:table-cell">Department</th>
//                                             <th className="hidden p-3 lg:table-cell">Company</th>
//                                             <th className="p-3">Status</th>
//                                             <th className="hidden p-3 md:table-cell">Join Date</th>
//                                             <th className="p-3">Actions</th>
//                                         </tr>
//                                     </thead>

//                                     <tbody>
//                                         {users.map((u) => (
//                                             <tr
//                                                 key={u._id}
//                                                 className="border-b border-gray-100 transition-colors hover:bg-blue-50"
//                                             >
//                                                 <td className="p-3">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
//                                                             {u.fullName.charAt(0).toUpperCase()}
//                                                         </div>
//                                                         <div className="min-w-0">
//                                                             <p className="truncate text-sm font-semibold text-gray-800">{u.fullName}</p>
//                                                             <p className="truncate text-xs text-gray-500">{u.email}</p>
//                                                         </div>
//                                                     </div>
//                                                 </td>

//                                                 <td className="hidden p-3 text-gray-600 sm:table-cell">
//                                                     <div className="truncate">{u.phone || "—"}</div>
//                                                 </td>

//                                                 <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

//                                                 <td className="hidden p-3 text-gray-700 md:table-cell">
//                                                     {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                                                 </td>

//                                                 <td className="hidden p-3 text-gray-700 lg:table-cell">{u.displayCompanyName || "—"}</td>

//                                                 <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

//                                                 <td className="hidden whitespace-nowrap p-3 text-gray-600 md:table-cell">
//                                                     {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
//                                                 </td>

//                                                 <td className="p-3">
//                                                     <div className="flex flex-wrap gap-2">
//                                                         <button
//                                                             onClick={() => handleViewClick(u)}
//                                                             className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                                         >
//                                                             <Eye size={16} />
//                                                         </button>
//                                                         <button
//                                                             onClick={() => handleEditClick(u)}
//                                                             className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
//                                                         >
//                                                             <Edit2 size={16} />
//                                                         </button>
//                                                         <button
//                                                             onClick={() => deleteUser(u._id, u.role)}
//                                                             className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
//                                                         >
//                                                             <Trash2 size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ================= VIEW MODAL ================= */}
//             {isViewModalOpen && viewingUser && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 p-3 backdrop-blur-sm sm:p-4">
//                     <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white shadow-xl">
//                         <div className="flex items-center justify-between border-b bg-blue-50 px-4 py-3 sm:px-6 sm:py-4">
//                             <h2 className="text-base font-semibold text-blue-900 sm:text-lg">User Details</h2>
//                             <button
//                                 onClick={handleCloseViewModal}
//                                 className="text-blue-500 hover:text-blue-700"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <div className="space-y-2 px-4 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
//                             <p>
//                                 <strong>Name:</strong> {viewingUser.fullName}
//                             </p>
//                             <p>
//                                 <strong>Email:</strong> {viewingUser.email}
//                             </p>
//                             <p>
//                                 <strong>Phone:</strong> {viewingUser.phone}
//                             </p>
//                             <p>
//                                 <strong>Department:</strong>{" "}
//                                 {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}
//                             </p>
//                             <p>
//                                 <strong>Company:</strong> {viewingUser.companyNames?.join(", ") || "—"}
//                             </p>
//                             <p>
//                                 <strong>Role:</strong> {viewingUser.role}
//                             </p>
//                             <p>
//                                 <strong>Salary:</strong> {viewingUser.salary ? `₹${viewingUser.salary.toLocaleString()}` : "—"}
//                             </p>
//                             <p>
//                                 <strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ================= EDIT MODALS ================= */}
//             {isEditModalOpen && editingUser && (
//                 <EditUser
//                     user={editingUser}
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveUser}
//                 />
//             )}

//             {isAdminEditOpen && editingUser && (
//                 <EditAdmin
//                     user={editingUser}
//                     isOpen={isAdminEditOpen}
//                     onClose={() => {
//                         setIsAdminEditOpen(false);
//                         setEditingUser(null);
//                     }}
//                     onSave={(updated) => {
//                         setIsAdminEditOpen(false);
//                         setEditingUser(null);
//                         handleSaveUser(updated);
//                     }}
//                 />
//             )}
//         </>
//     );
// };

// export default UserTable;


import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, X } from "lucide-react";
import EditUser from "./EditUser";
import EditAdmin from "./EditAdmin";

const API_URL = "http://localhost:4000";

const UserTable = ({ onlyAdmins = false, searchTerm, roleFilter, filterStatus = "all", onCounts }) => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);

    const userRole = localStorage.getItem("role");

    const normalizeRole = (role) => role?.toLowerCase();


    // Fetch Companies
    const fetchCompanies = async () => {
        const res = await fetch(`${API_URL}/company/all`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
        return data.companies || [];
    };

    // Fetch all data together
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const role = localStorage.getItem("role");
            let combined = [];

            if (onlyAdmins) {
                const adminRes = await fetch(`${API_URL}/getAdmins`);
                const adminData = await adminRes.json();
                if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
                combined = adminData.admins || adminData || [];
            } else if (role === "superAdmin") {
                const [adminRes, employeeRes] = await Promise.all([fetch(`${API_URL}/getAdmins`), fetch(`${API_URL}/employee/allEmployee`)]);

                const adminData = await adminRes.json();
                const employeeData = await employeeRes.json();
                if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
                if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

                const admins = adminData.admins || adminData || [];
                const employees = employeeData.employees || employeeData || [];

                combined = [...admins, ...employees];
            } else if (role === "admin") {
                const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
                const employeeData = await employeeRes.json();
                if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

                const employees = employeeData.employees || employeeData || [];
                combined = [...employees];
            } else {
                combined = [];
            }

            // Attach company names — fetch all companies once and map ids to names
            let allCompanies = [];
            try {
                allCompanies = await fetchCompanies();
                setCompanies(allCompanies);
            } catch (e) {
                allCompanies = [];
            }
            const companyMap = {};
            allCompanies.forEach((c) => {
                if (c && c._id) companyMap[c._id] = c.companyName || c.company?.companyName || "Unknown";
            });

            const usersWithCompanies = combined.map((user) => {
                let companyName = user.companyName || "—";

                try {
                    if (Array.isArray(user.company) && user.company.length > 0) {
                        const firstId = user.company[0];
                        const firstName = companyMap[firstId] || "Unknown";
                        companyName = user.company.length > 1 ? `${firstName} +${user.company.length - 1}` : firstName;
                    } else if (user.company && typeof user.company === "object" && user.company._id) {
                        companyName = companyMap[user.company._id] || "Unknown";
                    } else if (user.company && typeof user.company === "string") {
                        companyName = companyMap[user.company] || "Unknown";
                    }
                } catch (e) {
                    companyName = companyName || "Unknown";
                }

                return { ...user, displayCompanyName: companyName };
            });

            // Place Admins at the top, then sort by createdAt desc
            usersWithCompanies.sort((a, b) => {
                const aIsAdmin = (a.role && a.role.toString().toLowerCase() === "admin") || a.userType === "Admin";
                const bIsAdmin = (b.role && b.role.toString().toLowerCase() === "admin") || b.userType === "Admin";
                if (aIsAdmin && !bIsAdmin) return -1;
                if (!aIsAdmin && bIsAdmin) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // report overall counts (before role/search filtering)
            try {
                const totalActive = usersWithCompanies.filter((u) => u?.accountActive === true || u?.accountActive === "true").length;
                const totalInactive = usersWithCompanies.length - totalActive;
                onCounts && onCounts({ active: totalActive, inactive: totalInactive });
            } catch (e) {
                // ignore
            }

            // Role filter
            let filteredUsers = usersWithCompanies;
            if (roleFilter && roleFilter !== "All Roles") {
                filteredUsers = filteredUsers.filter((user) => normalizeRole(user.role || "employee") === normalizeRole(roleFilter));
            }

            // Search filter
            if (searchTerm) {
                filteredUsers = filteredUsers.filter((user) =>
                    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.displayCompanyName?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Status (active/inactive) filter from parent
            if (filterStatus && filterStatus !== "all") {
                filteredUsers = filteredUsers.filter((u) => {
                    if (filterStatus === "active") return u?.accountActive === true || u?.accountActive === "true";
                    if (filterStatus === "inactive") return !(u?.accountActive === true || u?.accountActive === "true");
                    return true;
                });
            }

            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch users or admins. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete User
    const deleteUser = async (id, role) => {
        const userRole = localStorage.getItem("role")?.toLowerCase();
        if (userRole !== "superadmin") {
            alert("Only superAdmin can delete users.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;

        try {
            let endpoint;
            if (role === "admin") endpoint = `${API_URL}/deleteAdmin/${id}`;
            else if (role === "employee") endpoint = `${API_URL}/employee/deleteEmployee/${id}`;
            else if (role === "superadmin") {
                alert("You cannot delete another superAdmin.");
                return;
            } else throw new Error("Invalid role specified.");

            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Failed to delete ${role}`);

            alert(`${role} deleted successfully`);
            fetchData();
        } catch (error) {
            console.error(`❌ Error deleting:`, error);
            alert(error.message);
        }
    };

    // Edit
    const handleEditClick = (user) => {
        if (user.role === "Admin" && userRole !== "superAdmin") {
            alert("You don't have permission to edit admins.");
            return;
        }
        setEditingUser(user);
        if (user.role === "Admin") setIsAdminEditOpen(true);
        else setIsEditModalOpen(true);
    };

    // View
    const handleViewClick = async (user) => {
        try {
            let companyNames = [];

            if (user.company && Array.isArray(user.company) && user.company.length > 0) {
                const companyPromises = user.company.map(async (companyId) => {
                    try {
                        const res = await fetch(`${API_URL}/company/${companyId}`);
                        if (!res.ok) return "Unknown";
                        const data = await res.json();
                        return data.company?.companyName || "Unknown";
                    } catch {
                        return "Unknown";
                    }
                });
                companyNames = await Promise.all(companyPromises);
            } else if (user.companyName) companyNames = [user.companyName];
            else if (user.company && typeof user.company === "object" && user.company._id) {
                try {
                    const res = await fetch(`${API_URL}/company/${user.company._id}`);
                    if (!res.ok) throw new Error("Failed to fetch company");
                    const data = await res.json();
                    companyNames = [data.company?.companyName || "Unknown"];
                } catch {
                    companyNames = ["Unknown"];
                }
            } else if (user.company && typeof user.company === "string") {
                try {
                    const res = await fetch(`${API_URL}/company/${user.company}`);
                    const data = await res.json();
                    companyNames = [data.company?.companyName || "Unknown"];
                } catch {
                    companyNames = ["Unknown"];
                }
            }

            setViewingUser({ ...user, companyNames });
            setIsViewModalOpen(true);
        } catch (error) {
            console.error("Error fetching companies:", error);
            setViewingUser({ ...user, companyNames: ["Unknown"] });
            setIsViewModalOpen(true);
        }
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingUser(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (updatedUser) => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getRoleBadge = (role) => {
        const colors = {
            Admin: "bg-purple-100 text-purple-700",
            Manager: "bg-[#2b7fff] text-white",
            "Sales Rep": "bg-[#00c951] text-white",
            Employee: "bg-blue-100 text-blue-700",
        };
        return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colors[role] || "bg-gray-100 text-gray-700"}`}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (status) => (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ${status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
        >
            {status}
        </span>
    );
    useEffect(() => {
        fetchData();
    }, [roleFilter, searchTerm, filterStatus]);

    return (
        <>
            <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6">
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md">
                    <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4">
                        <h2 className="text-base font-semibold text-blue-900 sm:text-lg">
                            {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
                        </h2>
                    </div>

                    {/* Loading spinner */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-600 border-gray-200" />
                        </div>
                    )}

                    {/* ================= MOBILE VIEW (XS–SM) ================= */}
                    {!loading && !error && users.length > 0 && (
                        <div className="space-y-3 p-3 sm:hidden">
                            {users.map((u) => (
                                <div
                                    key={u._id}
                                    className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                                {u.fullName?.[0]?.toUpperCase() || "?"}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-gray-800">{u.fullName}</p>
                                                <p className="max-w-[220px] truncate text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>{getRoleBadge(u.role || "Employee")}</div>
                                            <div>{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:text-sm">
                                        <div>
                                            <span className="font-medium">Dept:</span>{" "}
                                            {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Phone:</span> {u.phone || "—"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Company:</span> {u.displayCompanyName || "—"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Joined:</span>{" "}
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-3 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleViewClick(u)}
                                            className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(u)}
                                            className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(u._id, u.role)}
                                            className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ================= DESKTOP/TABLET VIEW (≥ SM) ================= */}
                    <div className="hidden sm:block">
                        {loading ? (
                            <div className="py-8 text-center text-sm font-medium text-blue-600 sm:text-base">Loading data...</div>
                        ) : error ? (
                            <div className="px-3 py-8 text-center text-sm text-red-500 sm:text-base">{error}</div>
                        ) : users.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500 sm:text-base">No records found.</div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead className="border-b border-blue-200 bg-blue-50">
                                        <tr className="text-left font-semibold text-blue-800">
                                            <th className="p-3">User</th>
                                            <th className="hidden p-3 sm:table-cell">Contact</th>
                                            <th className="p-3">Role</th>
                                            <th className="hidden p-3 md:table-cell">Department</th>
                                            <th className="hidden p-3 lg:table-cell">Company</th>
                                            <th className="p-3">Status</th>
                                            <th className="hidden p-3 md:table-cell">Join Date</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map((u) => (
                                            <tr
                                                key={u._id}
                                                className="border-b border-gray-100 transition-colors hover:bg-blue-50"
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
                                                            {u.fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-gray-800">{u.fullName}</p>
                                                            <p className="truncate text-xs text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="hidden p-3 text-gray-600 sm:table-cell">
                                                    <div className="truncate">{u.phone || "—"}</div>
                                                </td>

                                                <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

                                                <td className="hidden p-3 text-gray-700 md:table-cell">
                                                    {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
                                                </td>

                                                <td className="hidden p-3 text-gray-700 lg:table-cell">{u.displayCompanyName || "—"}</td>

                                                <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

                                                <td className="hidden whitespace-nowrap p-3 text-gray-600 md:table-cell">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => handleViewClick(u)}
                                                            className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(u)}
                                                            className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(u._id, u.role)}
                                                            className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= VIEW MODAL ================= */}
            {isViewModalOpen && viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 p-3 backdrop-blur-sm sm:p-4">
                    <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b bg-blue-50 px-4 py-3 sm:px-6 sm:py-4">
                            <h2 className="text-base font-semibold text-blue-900 sm:text-lg">User Details</h2>
                            <button
                                onClick={handleCloseViewModal}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 px-4 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
                            <p>
                                <strong>Name:</strong> {viewingUser.fullName}
                            </p>
                            <p>
                                <strong>Email:</strong> {viewingUser.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {viewingUser.phone}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}
                            </p>
                            <p>
                                <strong>Company:</strong> {viewingUser.companyNames?.join(", ") || "—"}
                            </p>
                            <p>
                                <strong>Role:</strong> {viewingUser.role}
                            </p>
                            <p>
                                <strong>Salary:</strong> {viewingUser.salary ? `₹${viewingUser.salary.toLocaleString()}` : "—"}
                            </p>
                            <p>
                                <strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODALS ================= */}
            {isEditModalOpen && editingUser && (
                <EditUser
                    user={editingUser}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveUser}
                />
            )}

            {isAdminEditOpen && editingUser && (
                <EditAdmin
                    user={editingUser}
                    isOpen={isAdminEditOpen}
                    onClose={() => {
                        setIsAdminEditOpen(false);
                        setEditingUser(null);
                    }}
                    onSave={(updated) => {
                        setIsAdminEditOpen(false);
                        setEditingUser(null);
                        handleSaveUser(updated);
                    }}
                />
            )}
        </>
    );
};

export default UserTable;