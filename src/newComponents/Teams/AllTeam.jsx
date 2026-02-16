// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // const AllTeam = () => {
// //   const [teams, setTeams] = useState([]);
// //   const [selectedTeam, setSelectedTeam] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const fetchTeams = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:4000/teams/");
// //         setTeams(res.data || []);
// //       } catch (err) {
// //         console.error(err);
// //         setError("Failed to fetch teams.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTeams();
// //   }, []);

// //   const handleCardClick = (team) => {
// //     setSelectedTeam(team);
// //   };

// //   if (loading) {
// //     return <div className="p-6 text-center text-gray-500">Loading teams...</div>;
// //   }

// //   if (error) {
// //     return <div className="p-6 text-center text-red-500">{error}</div>;
// //   }

// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <h2 className="text-3xl font-bold mb-6 text-center">All Teams</h2>

// //       {/* ------------------ TEAM LIST VIEW ------------------ */}
// //       {!selectedTeam ? (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {teams.length > 0 ? (
// //             teams.map((team) => (
// //               <div
// //                 key={team._id}
// //                 className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
// //                 onClick={() => handleCardClick(team)}
// //               >
// //                 <h3 className="text-xl font-semibold mb-2">
// //                   Team {team.teamLeader?.fullName.split(" ")[0]}'s Team
// //                 </h3>

// //                 <p className="text-gray-500">
// //                   <strong>Leader:</strong> {team.teamLeader?.fullName}
// //                 </p>

// //                 <p className="text-gray-500">
// //                   <strong>Total Members:</strong> {team.members?.length}
// //                 </p>
// //               </div>
// //             ))
// //           ) : (
// //             <p className="text-gray-500 text-center col-span-3">No teams found.</p>
// //           )}
// //         </div>
// //       ) : (
// //         /* ------------------ TEAM DETAILS VIEW ------------------ */
// //         <div className="bg-white p-6 rounded-xl shadow-md">
// //           <button
// //             className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
// //             onClick={() => setSelectedTeam(null)}
// //           >
// //             ← Back to Teams
// //           </button>

// //           <h3 className="text-2xl font-bold mb-2">
// //             Team Details - {selectedTeam.teamLeader?.fullName}
// //           </h3>

// //           <p className="mb-4 text-gray-600">
// //             <strong>Leader Email:</strong> {selectedTeam.teamLeader?.email}
// //           </p>

// //           <h4 className="text-xl font-semibold mb-4">Team Members</h4>

// //           <div className="space-y-4">
// //             {selectedTeam.members?.length > 0 ? (
// //               selectedTeam.members.map((member) => (
// //                 <div
// //                   key={member._id}
// //                   className="border rounded p-4 shadow-sm bg-gray-50"
// //                 >
// //                   <p>
// //                     <strong>Name:</strong> {member.fullName}
// //                   </p>
// //                   <p>
// //                     <strong>Email:</strong> {member.email}
// //                   </p>
// //                 </div>
// //               ))
// //             ) : (
// //               <p>No members found.</p>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AllTeam;




// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllTeam = () => {
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/teams/");
//         setTeams(res.data || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch teams.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []);

//   const handleCardClick = (team) => {
//     setSelectedTeam(team);
//   };

//   // Calculate team stats
//   const calculateTeamStats = (team) => {
//     const totalMembers = team.members?.length || 0;
//     const myLeads = Math.floor(Math.random() * 50); // Replace with actual data
//     const myClosed = Math.floor(Math.random() * 20); // Replace with actual data
//     const myRate = myLeads > 0 ? ((myClosed / myLeads) * 100).toFixed(1) : "0.0";
//     const teamRate = "32.9"; // Replace with actual calculation
    
//     return { totalMembers, myLeads, myClosed, myRate, teamRate };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
//         <div className="text-black text-xl">Loading teams...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
//         <div className="text-black text-xl">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 p-8">
//       {/* ------------------ TEAM LIST VIEW ------------------ */}
//       {!selectedTeam ? (
//         <div className="max-w-7xl mx-auto space-y-8">
//           <h2 className="text-4xl font-bold text-black mb-8">All Teams</h2>
          
//           <div className="grid grid-cols-1 gap-8">
//             {teams.length > 0 ? (
//               teams.map((team) => {
//                 const stats = calculateTeamStats(team);
//                 const leader = team.teamLeader || {};
//                 const initials = leader.fullName
//                   ? leader.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
//                   : "T";
                
//                 return (
//                   <div
//                     key={team._id}
//                     className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl cursor-pointer hover:bg-opacity-15 transition-all duration-300"
//                     onClick={() => handleCardClick(team)}
//                   >
//                     {/* Header Section */}
//                     <div className="flex items-start justify-between mb-8">
//                       <div className="flex items-center gap-6">
//                         <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
//                           <span className="text-3xl font-bold text-black">{initials}</span>
//                         </div>
//                         <div>
//                           <h3 className="text-3xl font-bold text-black mb-2">
//                             {leader.fullName || "Team Leader"}
//                           </h3>
//                           <div className="flex items-center gap-4 text-black text-opacity-90">
//                             <span className="flex items-center gap-2">
//                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                               </svg>
//                               {leader.email || "email@company.com"}
//                             </span>
//                             <span className="flex items-center gap-2">
//                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                               </svg>
//                               +1 (555) 999-0001
//                             </span>
//                           </div>
//                           <p className="text-black text-opacity-80 mt-3 flex items-center gap-2">
//                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
//                               <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
//                             </svg>
//                             Leading Enterprise Sales Team in San Francisco Bay Area - Strategic partnerships and key accounts
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Stats Grid */}
//                     <div className="grid grid-cols-5 gap-4 mb-6">
//                       <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                         <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                           </svg>
//                           <span>My Leads</span>
//                         </div>
//                         <div className="text-3xl font-bold text-black">{stats.myLeads}</div>
//                       </div>

//                       <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                         <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                           </svg>
//                           <span>My Closed</span>
//                         </div>
//                         <div className="text-3xl font-bold text-black">{stats.myClosed}</div>
//                       </div>

//                       <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                         <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                           </svg>
//                           <span>My Rate</span>
//                         </div>
//                         <div className="text-3xl font-bold text-black">{stats.myRate}%</div>
//                       </div>

//                       <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                         <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                           </svg>
//                           <span>Team Size</span>
//                         </div>
//                         <div className="text-3xl font-bold text-black">{stats.totalMembers}</div>
//                       </div>

//                       <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                         <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                           </svg>
//                           <span>Team Rate</span>
//                         </div>
//                         <div className="text-3xl font-bold text-black">{stats.teamRate}%</div>
//                       </div>
//                     </div>

//                     {/* Bottom Stats */}
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                         <div className="text-black text-opacity-70 text-sm mb-1">Total Team Leads</div>
//                         <div className="text-2xl font-bold text-black">234</div>
//                       </div>
//                       <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                         <div className="text-black text-opacity-70 text-sm mb-1">Total Closed Deals</div>
//                         <div className="text-2xl font-bold text-black">77</div>
//                       </div>
//                       <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                         <div className="text-black text-opacity-70 text-sm mb-1">Overall Conversion</div>
//                         <div className="text-2xl font-bold text-black">32.9%</div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-black text-center text-xl">No teams found.</div>
//             )}
//           </div>
//         </div>
//       ) : (
//         /* ------------------ TEAM DETAILS VIEW ------------------ */
//         <div className="max-w-7xl mx-auto">
//           <button
//             className="mb-6 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-black rounded-xl hover:bg-opacity-30 transition-all"
//             onClick={() => setSelectedTeam(null)}
//           >
//             ← Back to Teams
//           </button>

//           <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
//             <h3 className="text-3xl font-bold text-black mb-6">
//               Team Members - {selectedTeam.teamLeader?.fullName}
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {selectedTeam.members?.length > 0 ? (
//                 selectedTeam.members.map((member) => (
//                   <div
//                     key={member._id}
//                     className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm"
//                   >
//                     <div className="flex items-center gap-4 mb-3">
//                       <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
//                         <span className="text-lg font-bold text-black">
//                           {member.fullName?.split(" ").map(n => n[0]).join("").toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-black text-lg">{member.fullName}</p>
//                         <p className="text-black text-opacity-70 text-sm">{member.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-black text-opacity-80">No members found.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTeam;


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllTeam = () => {
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [expandedTeamId, setExpandedTeamId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/teams/");
//         setTeams(res.data || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch teams.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []);

//   const handleCardClick = (team) => {
//     setSelectedTeam(team);
//   };

//   const toggleTeamMembers = (teamId) => {
//     setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
//   };

//   // Calculate team stats
//   const calculateTeamStats = (team) => {
//     const totalMembers = team.members?.length || 0;
//     const myLeads = Math.floor(Math.random() * 50); // Replace with actual data
//     const myClosed = Math.floor(Math.random() * 20); // Replace with actual data
//     const myRate = myLeads > 0 ? ((myClosed / myLeads) * 100).toFixed(1) : "0.0";
//     const teamRate = "32.9"; // Replace with actual calculation
    
//     return { totalMembers, myLeads, myClosed, myRate, teamRate };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
//         <div className="text-black text-xl">Loading teams...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
//         <div className="text-black text-xl">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-black p-8">
//       {/* ------------------ TEAM LIST VIEW ------------------ */}
//       {!selectedTeam ? (
//         <div className="max-w-7xl mx-auto space-y-8">
//           <h2 className="text-4xl font-bold text-black mb-8">All Teams</h2>
          
//           <div className="grid grid-cols-1 gap-8">
//             {teams.length > 0 ? (
//               teams.map((team) => {
//                 const stats = calculateTeamStats(team);
//                 const leader = team.teamLeader || {};
//                 const initials = leader.fullName
//                   ? leader.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
//                   : "T";
                
//                 return (
//                   <div
//                     key={team._id}
//                     className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl"
//                   >
//                     <div className="p-8">
//                       {/* Header Section */}
//                       <div className="flex items-start justify-between mb-8">
//                         <div className="flex items-center gap-6">
//                           <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
//                             <span className="text-3xl font-bold text-black">{initials}</span>
//                           </div>
//                           <div>
//                             <h3 className="text-3xl font-bold text-black mb-2">
//                               {leader.fullName || "Team Leader"}
//                             </h3>
//                             <div className="flex items-center gap-4 text-black text-opacity-90">
//                               <span className="flex items-center gap-2">
//                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                                 </svg>
//                                 {leader.email || "email@company.com"}
//                               </span>
//                               <span className="flex items-center gap-2">
//                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                   <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                 </svg>
//                                 +1 (555) 999-0001
//                               </span>
//                             </div>
//                             <p className="text-black text-opacity-80 mt-3 flex items-center gap-2">
//                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
//                                 <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
//                               </svg>
//                               Leading Enterprise Sales Team in San Francisco Bay Area - Strategic partnerships and key accounts
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Stats Grid */}
//                       <div className="grid grid-cols-5 gap-4 mb-6">
//                         <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                           <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                             </svg>
//                             <span>My Leads</span>
//                           </div>
//                           <div className="text-3xl font-bold text-black">{stats.myLeads}</div>
//                         </div>

//                         <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                           <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             <span>My Closed</span>
//                           </div>
//                           <div className="text-3xl font-bold text-black">{stats.myClosed}</div>
//                         </div>

//                         <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                           <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                             </svg>
//                             <span>My Rate</span>
//                           </div>
//                           <div className="text-3xl font-bold text-black">{stats.myRate}%</div>
//                         </div>

//                         <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                           <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                             </svg>
//                             <span>Team Size</span>
//                           </div>
//                           <div className="text-3xl font-bold text-black">{stats.totalMembers}</div>
//                         </div>

//                         <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
//                           <div className="flex items-center gap-2 text-black text-opacity-80 text-sm mb-2">
//                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                             </svg>
//                             <span>Team Rate</span>
//                           </div>
//                           <div className="text-3xl font-bold text-black">{stats.teamRate}%</div>
//                         </div>
//                       </div>

//                       {/* Bottom Stats */}
//                       <div className="grid grid-cols-3 gap-4 mb-6">
//                         <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                           <div className="text-black text-opacity-70 text-sm mb-1">Total Team Leads</div>
//                           <div className="text-2xl font-bold text-black">234</div>
//                         </div>
//                         <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                           <div className="text-black text-opacity-70 text-sm mb-1">Total Closed Deals</div>
//                           <div className="text-2xl font-bold text-black">77</div>
//                         </div>
//                         <div className="bg-white bg-opacity-5 rounded-xl p-4">
//                           <div className="text-black text-opacity-70 text-sm mb-1">Overall Conversion</div>
//                           <div className="text-2xl font-bold text-black">32.9%</div>
//                         </div>
//                       </div>

//                       {/* Toggle Button */}
//                       <button
//                         onClick={() => toggleTeamMembers(team._id)}
//                         className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-black font-semibold transition-all flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                         </svg>
//                         {expandedTeamId === team._id ? 'Hide Team Members' : `View Team Members (${team.members?.length || 0})`}
//                         <svg 
//                           className={`w-5 h-5 transition-transform ${expandedTeamId === team._id ? 'rotate-180' : ''}`} 
//                           fill="currentColor" 
//                           viewBox="0 0 20 20"
//                         >
//                           <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                         </svg>
//                       </button>
//                     </div>

//                     {/* Team Members Section */}
//                     {expandedTeamId === team._id && team.members && team.members.length > 0 && (
//                       <div className="mt-8 pt-8 border-t border-white border-opacity-20">
//                         <div className="flex items-center justify-between mb-6">
//                           <h4 className="text-black text-2xl font-semibold flex items-center gap-2">
//                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                               <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                             </svg>
//                             Team Members ({team.members.length})
//                           </h4>
//                           <span className="text-black text-opacity-70 text-sm">All Active</span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                           {team.members.map((member, index) => {
//                             const memberInitials = member.fullName
//                               ? member.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
//                               : "M";
//                             const memberStats = {
//                               leads: Math.floor(Math.random() * 60),
//                               closed: Math.floor(Math.random() * 25),
//                             };
//                             memberStats.rate = memberStats.leads > 0 
//                               ? ((memberStats.closed / memberStats.leads) * 100).toFixed(1) 
//                               : "0.0";

//                             return (
//                               <div
//                                 key={member._id}
//                                 className="bg-white rounded-2xl p-6 shadow-lg"
//                               >
//                                 {/* Member Header */}
//                                 <div className="flex items-start gap-4 mb-4">
//                                   <div className={`w-16 h-16 ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-teal-500' : 'bg-teal-600'} rounded-2xl flex items-center justify-center relative`}>
//                                     <span className="text-xl font-bold text-black">{memberInitials}</span>
//                                     {index === 0 && (
//                                       <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
//                                         <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
//                                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                         </svg>
//                                       </div>
//                                     )}
//                                   </div>
//                                   <div className="flex-1">
//                                     <h5 className="text-lg font-bold text-gray-900 mb-1">{member.fullName}</h5>
//                                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
//                                       {index === 0 ? 'Senior Executive' : 'Sales Executive'}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* Contact Info */}
//                                 <div className="space-y-2 mb-4">
//                                   <div className="flex items-center gap-2 text-gray-600">
//                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                       <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                                       <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                                     </svg>
//                                     <span className="text-sm">{member.email}</span>
//                                   </div>
//                                   <div className="flex items-center gap-2 text-gray-600">
//                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                       <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                     </svg>
//                                     <span className="text-sm">+1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span>
//                                   </div>
//                                 </div>

//                                 {/* Current Assignment */}
//                                 <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                                   <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
//                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                       <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
//                                       <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
//                                     </svg>
//                                     Current Assignment
//                                   </div>
//                                   <p className="text-sm text-gray-700 leading-relaxed">
//                                     {index === 0 
//                                       ? "Enterprise accounts in San Francisco, CA - focusing on Fortune 500 companies in tech sector"
//                                       : index === 1
//                                       ? "Mid-market SaaS solutions in Boston, MA for healthcare providers"
//                                       : "Regional retail chains in New York, NY - Northeast territory expansion"}
//                                   </p>
//                                 </div>

//                                 {/* Stats */}
//                                 <div className="flex gap-2">
//                                   <div className="flex-1 bg-orange-500 rounded-xl p-3 text-black">
//                                     <div className="flex items-center gap-1 text-xs mb-1 opacity-90">
//                                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                         <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                                       </svg>
//                                       Leads
//                                     </div>
//                                     <div className="text-2xl font-bold">{memberStats.leads}</div>
//                                   </div>
//                                   <div className="flex-1 bg-green-500 rounded-xl p-3 text-black">
//                                     <div className="flex items-center gap-1 text-xs mb-1 opacity-90">
//                                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                       </svg>
//                                       Closed
//                                     </div>
//                                     <div className="text-2xl font-bold">{memberStats.closed}</div>
//                                   </div>
//                                   <div className="flex-1 bg-blue-500 rounded-xl p-3 text-black">
//                                     <div className="flex items-center gap-1 text-xs mb-1 opacity-90">
//                                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                                       </svg>
//                                       Rate
//                                     </div>
//                                     <div className="text-2xl font-bold">{memberStats.rate}%</div>
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-black text-center text-xl">No teams found.</div>
//             )}
//           </div>
//         </div>
//       ) : (
//         /* ------------------ TEAM DETAILS VIEW ------------------ */
//         <div className="max-w-7xl mx-auto">
//           <button
//             className="mb-6 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-black rounded-xl hover:bg-opacity-30 transition-all"
//             onClick={() => setSelectedTeam(null)}
//           >
//             ← Back to Teams
//           </button>

//           <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
//             <h3 className="text-3xl font-bold text-black mb-6">
//               Team Members - {selectedTeam.teamLeader?.fullName}
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {selectedTeam.members?.length > 0 ? (
//                 selectedTeam.members.map((member) => (
//                   <div
//                     key={member._id}
//                     className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm"
//                   >
//                     <div className="flex items-center gap-4 mb-3">
//                       <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
//                         <span className="text-lg font-bold text-black">
//                           {member.fullName?.split(" ").map(n => n[0]).join("").toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-black text-lg">{member.fullName}</p>
//                         <p className="text-black text-opacity-70 text-sm">{member.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-black text-opacity-80">No members found.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTeam;





// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllTeam = () => {
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch teams
//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/teams/");
//         setTeams(res.data);
//       } catch (error) {
//         console.error("Error fetching teams:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeams();
//   }, []);

//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   if (loading) return <p className="p-6 text-center">Loading teams...</p>;

//   return (
//     <div className="p-6 bg-[#F5FAFB] min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         All Teams
//       </h2>

//       {/* ---------------- TEAM LIST PAGE ---------------- */}
//       {!selectedTeam && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {teams.map((team) => (
//             <div
//               key={team._id}
//               onClick={() => setSelectedTeam(team)}
//               className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition"
//             >
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 Team #{team._id.slice(-4)}
//               </h3>
//               <p className="text-gray-600">
//                 Leader:{" "}
//                 <span className="font-medium">{team.teamLeader?.fullName}</span>
//               </p>
//               <p className="text-gray-600">
//                 Members: {team.members?.length || 0}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ---------------- TEAM DETAILS PAGE ---------------- */}
//       {selectedTeam && (
//         <div className="bg-white w-full p-8 rounded-2xl border border-gray-200 shadow-sm">
//           {/* Back Button */}
//           <button
//             onClick={() => setSelectedTeam(null)}
//             className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             ← Back to all teams
//           </button>

//           {/* TEAM LEADER HEADER */}
//           <div className="flex items-center gap-4 mb-8">
//             <div className="w-20 h-20 bg-[#D2EEF2] text-teal-700 font-bold text-3xl rounded-xl flex items-center justify-center">
//               {getInitials(selectedTeam.teamLeader.fullName)}
//             </div>

//             <div>
//               <p className="text-3xl font-bold text-gray-800">
//                 {selectedTeam.teamLeader.fullName}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 {selectedTeam.teamLeader.email}
//               </p>
//             </div>
//           </div>

//           {/* LEADER STATS */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
//             {[
//               { label: "My Leads", value: 49 },
//               { label: "My Closed", value: 7 },
//               { label: "My Rate", value: "14.3%" },
//               { label: "Team Size", value: selectedTeam.members.length },
//               { label: "Team Rate", value: "32.9%" },
//             ].map((box, idx) => (
//               <div
//                 key={idx}
//                 className="bg-[#F9FCFD] border border-gray-200 rounded-xl p-4"
//               >
//                 <p className="text-gray-600 text-sm">{box.label}</p>
//                 <p className="text-2xl font-bold text-teal-700">{box.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* TEAM MEMBERS SECTION */}
//           <h3 className="text-2xl font-bold text-gray-800 mb-4">
//             Team Members
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {selectedTeam.members.map((member) => {
//               // Example stats (Replace when backend gives real stats)
//               const leads = Math.floor(Math.random() * 50);
//               const closed = Math.floor(Math.random() * 20);
//               const rate = leads ? ((closed / leads) * 100).toFixed(1) : "0";

//               return (
//                 <div
//                   key={member._id}
//                   className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
//                 >
//                   {/* Member Header */}
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="w-16 h-16 bg-[#D2EEF2] text-teal-700 font-bold text-xl rounded-xl flex items-center justify-center">
//                       {getInitials(member.fullName)}
//                     </div>

//                     <div>
//                       <p className="font-semibold text-gray-800 text-lg">
//                         {member.fullName}
//                       </p>
//                       <p className="text-gray-600 text-sm">{member.email}</p>
//                     </div>
//                   </div>

//                   {/* Member Stats */}
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
//                     <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
//                       <p className="text-gray-600 text-xs">My Leads</p>
//                       <p className="text-xl font-bold text-teal-700">{leads}</p>
//                     </div>

//                     <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
//                       <p className="text-gray-600 text-xs">My Closed</p>
//                       <p className="text-xl font-bold text-teal-700">
//                         {closed}
//                       </p>
//                     </div>

//                     <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
//                       <p className="text-gray-600 text-xs">My Rate</p>
//                       <p className="text-xl font-bold text-teal-700">
//                         {rate}%
//                       </p>
//                     </div>
//                   </div>

//                   {/* Assignment Box */}
//                   <div className="bg-[#F6FAFB] border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
//                     Current Assignment:
//                     <span className="block mt-1 text-gray-600">
//                       (assignment goes here)
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTeam;





import React, { useState, useEffect } from "react";
import axios from "axios";

const AllTeam = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:4000/teams/");
        setTeams(res.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEdit = (teamId) => {
    console.log('Edit team:', teamId);
    // Add your edit logic here
    // Example: navigate to edit page or open modal
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`http://localhost:4000/teams/${teamId}`);
        setTeams(teams.filter(team => team._id !== teamId));
        console.log('Team deleted:', teamId);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  if (loading) return <p className="p-6 text-center">Loading teams...</p>;

  return (
    <div className="p-6 bg-[#F5FAFB] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Teams
      </h2>

      {/* ---------------- TEAM LIST PAGE ---------------- */}
      {!selectedTeam && (
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div 
                onClick={() => setSelectedTeam(team)}
                className="cursor-pointer flex-1"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Team #{team._id.slice(-4)}
                </h3>
                <p className="text-gray-600">
                  Leader:{" "}
                  <span className="font-medium">{team.teamLeader?.fullName}</span>
                </p>
                <p className="text-gray-600">
                  Members: {team.members?.length || 0}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(team._id);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(team._id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- TEAM DETAILS PAGE ---------------- */}
      {selectedTeam && (
        <div className="bg-white w-full p-8 rounded-2xl border border-gray-200 shadow-sm">
          {/* Back Button */}
          <button
            onClick={() => setSelectedTeam(null)}
            className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back to all teams
          </button>

          {/* TEAM LEADER HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-[#D2EEF2] text-teal-700 font-bold text-3xl rounded-xl flex items-center justify-center">
              {getInitials(selectedTeam.teamLeader.fullName)}
            </div>

            <div>
              <p className="text-3xl font-bold text-gray-800">
                {selectedTeam.teamLeader.fullName}
              </p>
              <p className="text-gray-600 text-sm">
                {selectedTeam.teamLeader.email}
              </p>
            </div>
          </div>

          {/* LEADER STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: "My Leads", value: 49 },
              { label: "My Closed", value: 7 },
              { label: "My Rate", value: "14.3%" },
              { label: "Team Size", value: selectedTeam.members.length },
              { label: "Team Rate", value: "32.9%" },
            ].map((box, idx) => (
              <div
                key={idx}
                className="bg-[#F9FCFD] border border-gray-200 rounded-xl p-4"
              >
                <p className="text-gray-600 text-sm">{box.label}</p>
                <p className="text-2xl font-bold text-teal-700">{box.value}</p>
              </div>
            ))}
          </div>

          {/* TEAM MEMBERS SECTION */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Team Members
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedTeam.members.map((member) => {
              // Example stats (Replace when backend gives real stats)
              const leads = Math.floor(Math.random() * 50);
              const closed = Math.floor(Math.random() * 20);
              const rate = leads ? ((closed / leads) * 100).toFixed(1) : "0";

              return (
                <div
                  key={member._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  {/* Member Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#D2EEF2] text-teal-700 font-bold text-xl rounded-xl flex items-center justify-center">
                      {getInitials(member.fullName)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {member.fullName}
                      </p>
                      <p className="text-gray-600 text-sm">{member.email}</p>
                    </div>
                  </div>

                  {/* Member Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
                      <p className="text-gray-600 text-xs">My Leads</p>
                      <p className="text-xl font-bold text-teal-700">{leads}</p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
                      <p className="text-gray-600 text-xs">My Closed</p>
                      <p className="text-xl font-bold text-teal-700">
                        {closed}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-3 bg-[#F9FCFD]">
                      <p className="text-gray-600 text-xs">My Rate</p>
                      <p className="text-xl font-bold text-teal-700">
                        {rate}%
                      </p>
                    </div>
                  </div>

                  {/* Assignment Box */}
                  <div className="bg-[#F6FAFB] border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                    Current Assignment:
                    <span className="block mt-1 text-gray-600">
                      (assignment goes here)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTeam;