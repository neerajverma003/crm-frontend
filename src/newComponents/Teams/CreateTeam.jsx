import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserPlus, ShieldCheck, CheckCircle2, Loader2, User } from "lucide-react";

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
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/allEmployee`);

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/teams/`, {
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
    <div className="max-w-4xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden relative">
        {/* Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-slate-100" />
        
        <div className="relative p-6 sm:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <Users size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Create Team</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Assign a leader and select members to form a new operational team.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Team Leader Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-indigo-600" strokeWidth={2.5} />
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-widest">Select Team Leader</label>
              </div>
              <div className="relative">
                <select
                  value={selectedLeader}
                  onChange={(e) => setSelectedLeader(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 font-bold text-slate-700 transition-colors appearance-none cursor-pointer"
                  disabled={loading || submitting}
                >
                  <option value="">-- Choose Leader --</option>
                  {loading ? (
                    <option disabled>Loading leaders...</option>
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
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-3">Only users with the 'BDE' designation can be selected as Team Leaders.</p>
            </div>

            {/* Team Members Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-600" strokeWidth={2.5} />
                  <label className="block text-sm font-bold text-slate-800 uppercase tracking-widest">Select Team Members</label>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                  {selectedEmployees.length} Selected
                </span>
              </div>
              
              <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden max-h-[320px] overflow-y-auto custom-scrollbar relative">
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mb-2 text-indigo-500" />
                    <p className="font-medium text-sm">Loading eligible employees...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500 font-medium bg-red-50">{error}</div>
                ) : employees.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {employees.map((emp) => {
                      const isSelected = selectedEmployees.includes(emp._id);
                      return (
                        <label 
                          key={emp._id} 
                          className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="relative flex items-center justify-center w-5 h-5 shrink-0 mr-4">
                            <input
                              type="checkbox"
                              onChange={() => handleEmployeeCheck(emp._id)}
                              checked={isSelected}
                              disabled={submitting}
                              className="peer absolute opacity-0 w-full h-full cursor-pointer"
                            />
                            <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                              <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                              <User size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className={`font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                {emp.fullName}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                {emp.designation?.designation || "Employee"}
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 font-medium">No employees available to add to a team.</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button
                onClick={handleCreateTeam}
                disabled={submitting || loading || !selectedLeader || selectedEmployees.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Team...
                  </>
                ) : (
                  <>
                    <Users size={20} strokeWidth={2.5} />
                    Finalize & Create Team
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
