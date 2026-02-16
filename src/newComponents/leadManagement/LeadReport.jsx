// import React, { useState } from 'react';
// import { BarChart3, Users, TrendingUp, MapPin } from 'lucide-react';

// export default function LeadReport() {
//   const [leads] = useState({
//     Dubai: 145,
//     Sikkim: 89,
//     Andaman: 67,
//     Thailand: 123
//   });

//   const totalLeads = Object.values(leads).reduce((sum, count) => sum + count, 0);
  
//   const getPercentage = (count) => ((count / totalLeads) * 100).toFixed(1);
  
//   const destinations = Object.entries(leads).map(([name, count]) => ({
//     name,
//     count,
//     percentage: getPercentage(count)
//   }));

//   const maxCount = Math.max(...Object.values(leads));

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-800">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">Lead Report</h1>
//               <p className="text-gray-700">Overview of leads by destination</p>
//             </div>
//             <div className="bg-gray-200 p-4 rounded-xl border-2 border-gray-800">
//               <BarChart3 className="w-12 h-12 text-gray-900" />
//             </div>
//           </div>
          
//           {/* Total Count Card */}
//           <div className="bg-gray-900 rounded-xl p-6 text-white border-2 border-gray-900">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-300 text-sm font-medium mb-1">Total Leads</p>
//                 <p className="text-5xl font-bold">{totalLeads}</p>
//               </div>
//               <Users className="w-16 h-16 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         {/* Destination Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {destinations.map((dest, index) => {            
//             return (
//               <div key={dest.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-800">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center">
//                     <div className="bg-gray-900 p-3 rounded-lg mr-4">
//                       <MapPin className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-900">{dest.name}</h3>
//                       <p className="text-gray-600 text-sm">Destination</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-3xl font-bold text-gray-900">{dest.count}</p>
//                     <p className="text-sm text-gray-600">leads</p>
//                   </div>
//                 </div>
                
//                 {/* Progress Bar */}
//                 <div className="mb-3">
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-xs text-gray-700">Share of Total</span>
//                     <span className="text-xs font-semibold text-gray-900">{dest.percentage}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-400">
//                     <div 
//                       className="bg-gray-900 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${dest.percentage}%` }}
//                     />
//                   </div>
//                 </div>
                
//                 {/* Bar Chart Visualization */}
//                 <div className="mt-4">
//                   <div className="relative h-20 flex items-end">
//                     <div 
//                       className="bg-gray-800 rounded-t-lg transition-all duration-500"
//                       style={{ 
//                         width: '100%', 
//                         height: `${(dest.count / maxCount) * 100}%` 
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Summary Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-800">
//           <div className="bg-gray-900 p-6">
//             <h2 className="text-2xl font-bold text-white flex items-center">
//               <TrendingUp className="w-6 h-6 mr-2" />
//               Detailed Breakdown
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-200 border-b-2 border-gray-800">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Rank</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Destination</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Lead Count</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Percentage</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-300">
//                 {destinations
//                   .sort((a, b) => b.count - a.count)
//                   .map((dest, index) => (
//                     <tr key={dest.name} className="hover:bg-gray-100 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-semibold">
//                           {index + 1}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <MapPin className="w-5 h-5 text-gray-700 mr-2" />
//                           <span className="font-semibold text-gray-900">{dest.name}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-2xl font-bold text-gray-900">{dest.count}</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-lg font-semibold text-gray-800">{dest.percentage}%</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
//                           index === 0 
//                             ? 'bg-gray-900 text-white border-gray-900' 
//                             : index === destinations.length - 1
//                             ? 'bg-white text-gray-900 border-gray-900'
//                             : 'bg-gray-300 text-gray-900 border-gray-600'
//                         }`}>
//                           {index === 0 ? 'Top Performer' : index === destinations.length - 1 ? 'Needs Focus' : 'Performing Well'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, MapPin } from 'lucide-react';

export default function LeadReport() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================================
  // Fetch leads from API
  // ===============================================
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:4000/leads/');
        const result = await response.json();
        if (result.success) {
          setLeads(result.data || []);
        } else {
          setLeads([]);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-700">Loading lead data...</div>;
  }

  // ===============================================
  // Count leads per destination
  // ===============================================
  const destinationCounts = leads.reduce((acc, lead) => {
    const dest = lead.destination || 'Unknown';
    acc[dest] = (acc[dest] || 0) + 1;
    return acc;
  }, {});

  const totalLeads = Object.values(destinationCounts).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count) => ((count / totalLeads) * 100).toFixed(1);

  const destinations = Object.entries(destinationCounts).map(([name, count]) => ({
    name,
    count,
    percentage: getPercentage(count),
  }));

  const maxCount = Math.max(...Object.values(destinationCounts));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Lead Report</h1>
              <p className="text-gray-700">Overview of leads by destination</p>
            </div>
            <div className="bg-gray-200 p-4 rounded-xl border-2 border-gray-800">
              <BarChart3 className="w-12 h-12 text-gray-900" />
            </div>
          </div>
          
          {/* Total Count Card */}
          <div className="bg-gray-900 rounded-xl p-6 text-white border-2 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium mb-1">Total Leads</p>
                <p className="text-5xl font-bold">{totalLeads}</p>
              </div>
              <Users className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {destinations.map((dest) => (
            <div key={dest.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-900 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{dest.name}</h3>
                    <p className="text-gray-600 text-sm">Destination</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{dest.count}</p>
                  <p className="text-sm text-gray-600">leads</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-700">Share of Total</span>
                  <span className="text-xs font-semibold text-gray-900">{dest.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-400">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dest.percentage}%` }}
                  />
                </div>
              </div>
              
              {/* Bar Chart Visualization */}
              <div className="mt-4">
                <div className="relative h-20 flex items-end">
                  <div 
                    className="bg-gray-800 rounded-t-lg transition-all duration-500"
                    style={{ 
                      width: '100%', 
                      height: `${(dest.count / maxCount) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-800">
          <div className="bg-gray-900 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Detailed Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b-2 border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Lead Count</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {destinations
                  .sort((a, b) => b.count - a.count)
                  .map((dest, index) => (
                    <tr key={dest.name} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-700 mr-2" />
                          <span className="font-semibold text-gray-900">{dest.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl font-bold text-gray-900">{dest.count}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-gray-800">{dest.percentage}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                          index === 0 
                            ? 'bg-gray-900 text-white border-gray-900' 
                            : index === destinations.length - 1
                            ? 'bg-white text-gray-900 border-gray-900'
                            : 'bg-gray-300 text-gray-900 border-gray-600'
                        }`}>
                          {index === 0 ? 'Top Performer' : index === destinations.length - 1 ? 'Needs Focus' : 'Performing Well'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
