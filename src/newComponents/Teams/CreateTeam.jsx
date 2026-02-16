// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CreateTeam = () => {
//   const [teamLeaders, setTeamLeaders] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedLeader, setSelectedLeader] = useState("");
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:4000/employee/allEmployee");

//         if (data.success && Array.isArray(data.employees)) {
//           // Filter BDEs for leaders
//           const bdeLeaders = data.employees.filter(
//             (emp) => emp.designation?.designation === "BDE"
//           );
//           setTeamLeaders(bdeLeaders);

//           // Employees excluding BDEs for members
//           const nonBdeEmployees = data.employees.filter(
//             (emp) => emp.designation?.designation !== "BDE"
//           );
//           setEmployees(nonBdeEmployees);
//         } else {
//           setError("No employees found.");
//         }
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         setError("Failed to load employees.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleEmployeeCheck = (id) => {
//     setSelectedEmployees((prev) =>
//       prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
//     );
//   };

//   const handleCreateTeam = () => {
//     if (!selectedLeader) {
//       alert("Please select a team leader.");
//       return;
//     }
//     if (selectedEmployees.length === 0) {
//       alert("Please select at least one team member.");
//       return;
//     }

//     console.log("Team Leader:", selectedLeader);
//     console.log("Team Members:", selectedEmployees);
//     alert("Team Created Successfully (Dummy Action)");
//     // Replace with actual API call to save team
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-semibold text-center mb-6">Create Team</h2>

//         {/* Team Leader Select */}
//         <label className="block font-medium mb-2">Select Team Leader</label>
//         <select
//           value={selectedLeader}
//           onChange={(e) => setSelectedLeader(e.target.value)}
//           className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//         >
//           <option value="">-- Choose Leader --</option>
//           {loading ? (
//             <option disabled>Loading...</option>
//           ) : error ? (
//             <option disabled>{error}</option>
//           ) : teamLeaders.length > 0 ? (
//             teamLeaders.map((leader) => (
//               <option key={leader._id} value={leader._id}>
//                 {leader.fullName}
//               </option>
//             ))
//           ) : (
//             <option disabled>No BDE leaders found</option>
//           )}
//         </select>

//         {/* Employees List (excluding BDEs) */}
//         <label className="block font-medium mb-2">Select Team Members</label>
//         <div className="max-h-60 overflow-y-auto mb-6 border border-gray-200 rounded-md p-2">
//           {loading ? (
//             <p className="text-gray-500">Loading employees...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : employees.length > 0 ? (
//             employees.map((emp) => (
//               <div key={emp._id} className="flex items-center mb-2">
//                 <input
//                   type="checkbox"
//                   onChange={() => handleEmployeeCheck(emp._id)}
//                   checked={selectedEmployees.includes(emp._id)}
//                   className="mr-3 h-4 w-4 text-black rounded focus:ring-2 focus:ring-black"
//                 />
//                 <span>{emp.fullName}</span>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No employees available</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleCreateTeam}
//           className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//         >
//           Create Team
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateTeam;




import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTeam = () => {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/employee/allEmployee");

        if (data.success && Array.isArray(data.employees)) {
          const bdeLeaders = data.employees.filter(
            (emp) => emp.designation?.designation === "BDE"
          );
          setTeamLeaders(bdeLeaders);

          const nonBdeEmployees = data.employees.filter(
            (emp) => emp.designation?.designation !== "BDE"
          );
          setEmployees(nonBdeEmployees);
        } else {
          setError("No employees found.");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeCheck = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleCreateTeam = async () => {
    if (!selectedLeader) {
      alert("Please select a team leader.");
      return;
    }
    if (selectedEmployees.length === 0) {
      alert("Please select at least one team member.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post("http://localhost:4000/teams/", {
        teamLeaderId: selectedLeader,
        memberIds: selectedEmployees,
      });

      if (response.status === 201) {
        alert("Team created successfully!");
        setSelectedLeader("");
        setSelectedEmployees([]);
      }
    } catch (err) {
      console.error("Error creating team:", err);
      const msg = err.response?.data?.message || "Failed to create team";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Team</h2>

        {/* Team Leader Select */}
        <label className="block font-medium mb-2">Select Team Leader</label>
        <select
          value={selectedLeader}
          onChange={(e) => setSelectedLeader(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading || submitting}
        >
          <option value="">-- Choose Leader --</option>
          {loading ? (
            <option disabled>Loading...</option>
          ) : error ? (
            <option disabled>{error}</option>
          ) : teamLeaders.length > 0 ? (
            teamLeaders.map((leader) => (
              <option key={leader._id} value={leader._id}>
                {leader.fullName}
              </option>
            ))
          ) : (
            <option disabled>No BDE leaders found</option>
          )}
        </select>

        {/* Employees List */}
        <label className="block font-medium mb-2">Select Team Members</label>
        <div className="max-h-60 overflow-y-auto mb-6 border border-gray-200 rounded-md p-2">
          {loading ? (
            <p className="text-gray-500">Loading employees...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : employees.length > 0 ? (
            employees.map((emp) => (
              <div key={emp._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  onChange={() => handleEmployeeCheck(emp._id)}
                  checked={selectedEmployees.includes(emp._id)}
                  className="mr-3 h-4 w-4 text-black rounded focus:ring-2 focus:ring-black"
                  disabled={submitting}
                />
                <span>{emp.fullName}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No employees available</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateTeam}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          disabled={submitting || loading}
        >
          {submitting ? "Creating..." : "Create Team"}
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
