// import React, { useEffect, useState } from "react";

// const AssignRoleToAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     selectedAdmin: "",
//     selectedCompany: "",
//     selectedRoles: [],       // multiple roles
//     selectedSubRoles: [],    // multiple subroles
//     selectedPoints: [],      // multiple points
//   });

//   // Fetch admins
//   const getAllAdmins = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/getAdmin");
//       const data = await res.json();
//       setAdmins(data || []);
//     } catch (err) {
//       console.error("Failed to fetch admins:", err);
//     }
//   };

//   // Fetch roles
//   const getAllRoles = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/role/getrole");
//       const data = await res.json();
//       setRoles(data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch roles:", err);
//     }
//   };

//   // Fetch companies
//   const getAllCompanies = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/company/all");
//       const data = await res.json();
//       setCompanies(data.companies || []);
//     } catch (err) {
//       console.error("Failed to fetch companies:", err);
//     }
//   };

//   useEffect(() => {
//     getAllAdmins();
//     getAllCompanies();
//     getAllRoles();
//   }, []);

//   // Toggle selection helpers
//   const toggleSelection = (array, item) =>
//     array.includes(item)
//       ? array.filter((i) => i !== item)
//       : [...array, item];

//   const handleRoleToggle = (role) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedRoles: toggleSelection(prev.selectedRoles, role),
//     }));
//   };

//   const handleSubRoleToggle = (subRoleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
//     }));
//   };

//   const handlePointToggle = (point) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPoints: toggleSelection(prev.selectedPoints, point),
//     }));
//   };

//   // Submit handler
//  const handleAssign = async () => {
//   const { selectedAdmin, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } =
//     formData;

//   if (!selectedAdmin) return alert("Please select an admin.");
//   if (!selectedCompany) return alert("Please select a company.");
//   if (!selectedRoles.length) return alert("Please select at least one role.");

//   setLoading(true);

//   try {
//     const payload = {
//       adminId: selectedAdmin,
//       companyIds: [selectedCompany], // wrap in array for backend
//       workRoles: selectedRoles,      // role IDs
//       subRoles: selectedSubRoles,    // array of subRole IDs
//       points: selectedPoints,        // array of points
//     };

//     const res = await fetch("http://localhost:4000/assign", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();

//     if (res.ok) {
//       alert("Work role assigned successfully ✅");
//       setFormData({
//         selectedAdmin: "",
//         selectedCompany: "",
//         selectedRoles: [],
//         selectedSubRoles: [],
//         selectedPoints: [],
//       });
//     } else {
//       alert(result.message || "Failed to assign work role.");
//     }
//   } catch (error) {
//     console.error("Error assigning work role:", error);
//     alert("Something went wrong. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };



//   // Filter companies for selected admin
//   const selectedAdminObj = admins.find((admin) => admin._id === formData.selectedAdmin);
//   const filteredCompanies = selectedAdminObj
//     ? companies.filter((comp) => selectedAdminObj.company.includes(comp._id))
//     : companies;

//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Assign Work Role to Admin
//       </h2>

//       <form className="grid grid-cols-1 gap-4">
//         {/* Admin */}
//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">Select Admin</label>
//           <select
//             value={formData.selectedAdmin}
//             onChange={(e) => setFormData({ ...formData, selectedAdmin: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Admin --</option>
//             {admins.map((admin) => (
//               <option key={admin._id} value={admin._id}>
//                 {admin.fullName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Company */}
//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">Select Company</label>
//           <select
//             value={formData.selectedCompany}
//             onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Company --</option>
//             {filteredCompanies.map((company) => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Roles / Subroles / Points */}
//         <div className="flex flex-col border p-4 rounded-md bg-gray-50">
//           <label className="font-medium text-gray-700 mb-2">Roles, SubRoles & Points</label>

//           {roles.map((role) => (
//             <div key={role._id} className="mb-3 border-b pb-2">
//               {/* Role */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.selectedRoles.includes(role.role)}
//                   onChange={() => handleRoleToggle(role.role)}
//                 />
//                 {role.role}
//               </label>

//               {/* Subroles */}
//               {Array.isArray(role.subRole) &&
//                 role.subRole.map((sub) => (
//                   <div key={sub._id} className="ml-6 mt-1">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.selectedSubRoles.includes(sub._id)}
//                         onChange={() => handleSubRoleToggle(sub._id)}
//                       />
//                       {sub.subRoleName}
//                     </label>

//                     {/* Points */}
//                     {Array.isArray(sub.points) &&
//                       sub.points.map((point, idx) => (
//                         <label key={idx} className="flex items-center gap-2 ml-6">
//                           <input
//                             type="checkbox"
//                             checked={formData.selectedPoints.includes(point)}
//                             onChange={() => handlePointToggle(point)}
//                           />
//                           {point}
//                         </label>
//                       ))}
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit */}
//         <button
//           type="button"
//           onClick={handleAssign}
//           disabled={loading}
//           className={`w-full py-3 rounded-md text-white font-semibold ${
//             loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
//           } transition-colors`}
//         >
//           {loading ? "Assigning..." : "Assign Work Role"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AssignRoleToAdmin;


// import React, { useEffect, useState } from "react";

// const AssignRoleToAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     selectedAdmin: "",
//     selectedCompany: "",
//     selectedRoles: [],
//     selectedSubRoles: [],
//     selectedPoints: [],
//   });

//   // 🔹 Fetch Admins
//   const getAllAdmins = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/getAdmins");
//       const data = await res.json();
//       setAdmins(data || []);
//     } catch (err) {
//       console.error("❌ Failed to fetch admins:", err);
//     }
//   };

//   // 🔹 Fetch Roles
//   const getAllRoles = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/role/getrole");
//       const data = await res.json();
//       setRoles(data.data || []);
//     } catch (err) {
//       console.error("❌ Failed to fetch roles:", err);
//     }
//   };

//   // 🔹 Fetch Companies
//   const getAllCompanies = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/company/all");
//       const data = await res.json();
//       setCompanies(data.companies || []);
//     } catch (err) {
//       console.error("❌ Failed to fetch companies:", err);
//     }
//   };

//   // 🔹 Fetch Companies for specific Admin
//   const getCompaniesByAdmin = async (adminId) => {
//     try {
//       const res = await fetch(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
//       const data = await res.json();
      
//       if (res.ok && data.success) {
//         setCompanies(data.assignedCompanies || []);
//       } else {
//         // If no companies assigned, fallback to all companies
//         getAllCompanies();
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch admin companies:", err);
//       // Fallback to all companies on error
//       getAllCompanies();
//     }
//   };

//   useEffect(() => {
//     getAllAdmins();
//     getAllRoles();
//   }, []);

//   // 🔹 Auto-fetch companies when admin is selected
//   useEffect(() => {
//     if (formData.selectedAdmin) {
//       getCompaniesByAdmin(formData.selectedAdmin);
//     } else {
//       // Reset companies when no admin is selected
//       setCompanies([]);
//     }
//   }, [formData.selectedAdmin]);

//   // 🔹 Toggle helpers
//   const toggleSelection = (array, item) =>
//     array.includes(item)
//       ? array.filter((i) => i !== item)
//       : [...array, item];

//   const handleRoleToggle = (role) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedRoles: toggleSelection(prev.selectedRoles, role),
//     }));
//   };

//   const handleSubRoleToggle = (subRoleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
//     }));
//   };

//   const handlePointToggle = (point) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPoints: toggleSelection(prev.selectedPoints, point),
//     }));
//   };

//   // 🔹 Submit Handler
//   const handleAssign = async () => {
//     const { selectedAdmin, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } =
//       formData;

//     if (!selectedAdmin) return alert("Please select an admin.");
//     if (!selectedCompany) return alert("Please select a company.");
//     if (!selectedRoles.length) return alert("Please select at least one role.");

//     setLoading(true);

//     try {
//       const payload = {
//         adminId: selectedAdmin,
//         companyIds: [selectedCompany],
//         workRoles: selectedRoles,
//         subRoles: selectedSubRoles,
//         points: selectedPoints,
//       };

//       // 🟢 Log payload before posting
//       console.log("📤 Sending Payload to Backend:");
//       console.log(JSON.stringify(payload, null, 2));

//       const res = await fetch("http://localhost:4000/assignrole", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();

//       // 🟢 Log backend response
//       console.log("📥 Server Response:", result);

//       if (res.ok) {
//         alert("✅ Work role assigned successfully!");
//         setFormData({
//           selectedAdmin: "",
//           selectedCompany: "",
//           selectedRoles: [],
//           selectedSubRoles: [],
//           selectedPoints: [],
//         });
//         setCompanies([]); // Clear companies on successful assignment
//       } else {
//         alert(result.message || "❌ Failed to assign work role.");
//       }
//     } catch (error) {
//       console.error("❌ Error assigning work role:", error);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Filter companies for selected admin
//   const selectedAdminObj = admins.find((admin) => admin._id === formData.selectedAdmin);
//   const filteredCompanies = selectedAdminObj
//     ? companies.filter((comp) => selectedAdminObj.company.includes(comp._id))
//     : companies;

//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Assign Work Role to Admin
//       </h2>

//       <form className="grid grid-cols-1 gap-4">
//         {/* Admin */}
//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">Select Admin</label>
//           <select
//             value={formData.selectedAdmin}
//             onChange={(e) =>
//               setFormData({ ...formData, selectedAdmin: e.target.value })
//             }
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Admin --</option>
//             {admins.map((admin) => (
//               <option key={admin._id} value={admin._id}>
//                 {admin.fullName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Company */}
//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">Select Company</label>
//           <select
//             value={formData.selectedCompany}
//             onChange={(e) =>
//               setFormData({ ...formData, selectedCompany: e.target.value })
//             }
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Company --</option>
//             {filteredCompanies.map((company) => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Roles / Subroles / Points */}
//         <div className="flex flex-col border p-4 rounded-md bg-gray-50">
//           <label className="font-medium text-gray-700 mb-2">
//             Roles, SubRoles & Points
//           </label>

//           {roles.map((role) => (
//             <div key={role._id} className="mb-3 border-b pb-2">
//               {/* Role */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.selectedRoles.includes(role.role)}
//                   onChange={() => handleRoleToggle(role.role)}
//                 />
//                 {role.role}
//               </label>

//               {/* Subroles */}
//               {Array.isArray(role.subRole) &&
//                 role.subRole.map((sub) => (
//                   <div key={sub._id || sub.subRoleName} className="ml-6 mt-1">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.selectedSubRoles.includes(sub._id)}
//                         onChange={() => handleSubRoleToggle(sub._id)}
//                       />
//                       {sub.subRoleName}
//                     </label>

//                     {/* Points */}
//                     {Array.isArray(sub.points) &&
//                       sub.points.map((point, idx) => (
//                         <label key={idx} className="flex items-center gap-2 ml-6">
//                           <input
//                             type="checkbox"
//                             checked={formData.selectedPoints.includes(point)}
//                             onChange={() => handlePointToggle(point)}
//                           />
//                           {point}
//                         </label>
//                       ))}
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit */}
//         <button
//           type="button"
//           onClick={handleAssign}
//           disabled={loading}
//           className={`w-full py-3 rounded-md text-white font-semibold ${
//             loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
//           } transition-colors`}
//         >
//           {loading ? "Assigning..." : "Assign Work Role"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AssignRoleToAdmin;




import React, { useEffect, useState } from "react";

const AssignRoleToAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedAdmin: "",
    selectedCompany: "",
    selectedRoles: [],
    selectedSubRoles: [],
    selectedPoints: [],
  });

  // 🔹 Fetch Admins
  const getAllAdmins = async () => {
    try {
      const res = await fetch("http://localhost:4000/getAdmins");
      const data = await res.json();
      setAdmins(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch admins:", err);
    }
  };

  // 🔹 Fetch Roles
  const getAllRoles = async () => {
    try {
      const res = await fetch("http://localhost:4000/role/getrole");
      const data = await res.json();
      setRoles(data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch roles:", err);
    }
  };

  // 🔹 Fetch Companies
  const getAllCompanies = async () => {
    try {
      const res = await fetch("http://localhost:4000/company/all");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error("❌ Failed to fetch companies:", err);
    }
  };

  // 🔹 Fetch Companies for specific Admin
  const getCompaniesByAdmin = async (adminId) => {
    try {
      const res = await fetch(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setCompanies(data.assignedCompanies || []);
      } else {
        // If no companies assigned, fallback to all companies
        getAllCompanies();
      }
    } catch (err) {
      console.error("❌ Failed to fetch admin companies:", err);
      getAllCompanies(); // fallback
    }
  };

  useEffect(() => {
    getAllAdmins();
    getAllRoles();
  }, []);

  // 🔹 Auto-fetch companies when admin is selected
  useEffect(() => {
    if (formData.selectedAdmin) {
      getCompaniesByAdmin(formData.selectedAdmin);
    } else {
      setCompanies([]);
    }
  }, [formData.selectedAdmin]);

  // 🔹 Toggle helpers
  const toggleSelection = (array, item) =>
    array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];

  // 🔹 Role toggle
  const handleRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoles: toggleSelection(prev.selectedRoles, role),
    }));
  };

  // 🔹 SubRole toggle — ✅ no auto-adding points
  const handleSubRoleToggle = (subRoleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
    }));
  };

  // 🔹 Point toggle — ✅ independent from subroles
  const handlePointToggle = (point) => {
    setFormData((prev) => ({
      ...prev,
      selectedPoints: toggleSelection(prev.selectedPoints, point),
    }));
  };

  // 🔹 Submit Handler
  const handleAssign = async () => {
    const { selectedAdmin, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } =
      formData;

    if (!selectedAdmin) return alert("Please select an admin.");
    if (!selectedCompany) return alert("Please select a company.");
    if (!selectedRoles.length) return alert("Please select at least one role.");

    setLoading(true);

    try {
      const payload = {
        adminId: selectedAdmin,
        companyIds: [selectedCompany],
        workRoles: selectedRoles,
        subRoles: selectedSubRoles,
        points: selectedPoints,
      };

      console.log("📤 Sending Payload:", JSON.stringify(payload, null, 2));

      const res = await fetch("http://localhost:4000/assignrole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("📥 Server Response:", result);

      if (res.ok) {
        alert("✅ Work role assigned successfully!");
        setFormData({
          selectedAdmin: "",
          selectedCompany: "",
          selectedRoles: [],
          selectedSubRoles: [],
          selectedPoints: [],
        });
        setCompanies([]);
      } else {
        alert(result.message || "❌ Failed to assign work role.");
      }
    } catch (error) {
      console.error("❌ Error assigning work role:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter companies for selected admin
  const selectedAdminObj = admins.find((admin) => admin._id === formData.selectedAdmin);
  const filteredCompanies = selectedAdminObj
    ? companies.filter((comp) => selectedAdminObj.company.includes(comp._id))
    : companies;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Assign Work Role to Admin
      </h2>

      <form className="grid grid-cols-1 gap-4">
        {/* Admin */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Select Admin</label>
          <select
            value={formData.selectedAdmin}
            onChange={(e) =>
              setFormData({ ...formData, selectedAdmin: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">-- Choose Admin --</option>
            {admins.filter((admin) => admin.accountActive).map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Select Company</label>
          <select
            value={formData.selectedCompany}
            onChange={(e) =>
              setFormData({ ...formData, selectedCompany: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">-- Choose Company --</option>
            {filteredCompanies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Roles / Subroles / Points */}
        <div className="flex flex-col border p-4 rounded-md bg-gray-50">
          <label className="font-medium text-gray-700 mb-2">
            Roles, SubRoles & Points
          </label>

          {roles.map((role) => (
            <div key={role._id} className="mb-3 border-b pb-2">
              {/* Role */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.selectedRoles.includes(role.role)}
                  onChange={() => handleRoleToggle(role.role)}
                />
                {role.role}
              </label>

              {/* Subroles */}
              {Array.isArray(role.subRole) &&
                role.subRole.map((sub) => (
                  <div key={sub._id || sub.subRoleName} className="ml-6 mt-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedSubRoles.includes(sub._id)}
                        onChange={() => handleSubRoleToggle(sub._id)}
                      />
                      {sub.subRoleName}
                    </label>

                    {/* ✅ Points are now independent checkboxes */}
                    {Array.isArray(sub.points) &&
                      sub.points.map((point, idx) => (
                        <label key={idx} className="flex items-center gap-2 ml-6">
                          <input
                            type="checkbox"
                            checked={formData.selectedPoints.includes(point)}
                            onChange={() => handlePointToggle(point)}
                          />
                          {point}
                        </label>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleAssign}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Assigning..." : "Assign Work Role"}
        </button>
      </form>
    </div>
  );
};

export default AssignRoleToAdmin;
