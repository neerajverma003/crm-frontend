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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/leads/`);
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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2 tracking-tight">Lead Report</h1>
              <p className="text-slate-500 font-medium">Overview of leads by destination</p>
            </div>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl border border-blue-100/50 shadow-inner">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
          </div>
          
          {/* Total Count Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">Total Leads</p>
                <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">{totalLeads}</p>
              </div>
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {destinations.map((dest) => (
            <div key={dest.name} className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300 group hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-indigo-50 p-3 rounded-xl mr-3 group-hover:bg-indigo-600 transition-colors duration-300 shadow-inner">
                    <MapPin className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">{dest.name}</h3>
                    <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wide mt-0.5">Destination</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{dest.count}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">leads</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Share of Total</span>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{dest.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${dest.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="md:bg-white md:rounded-3xl md:shadow-sm overflow-hidden md:border md:border-slate-200">
          <div className="bg-transparent md:bg-white px-0 py-4 sm:p-6 border-b border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center tracking-tight">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600" />
              Detailed Breakdown
            </h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Count</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {destinations
                  .sort((a, b) => b.count - a.count)
                  .map((dest, index) => (
                    <tr key={dest.name} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' :
                          index === 1 ? 'bg-slate-200 text-slate-700 ring-1 ring-slate-300' :
                          index === 2 ? 'bg-orange-100 text-orange-800 ring-1 ring-orange-300' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-indigo-500 mr-3" />
                          <span className="font-bold text-slate-800">{dest.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl font-extrabold text-blue-600">{dest.count}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">{dest.percentage}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          index === 0 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : index === destinations.length - 1
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {index === 0 ? 'Top Performer' : index === destinations.length - 1 ? 'Needs Focus' : 'Performing Well'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden px-0 pb-4 space-y-4">
            {destinations
              .sort((a, b) => b.count - a.count)
              .map((dest, index) => (
                <div key={dest.name} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    index === 0 ? 'bg-emerald-500' : index === destinations.length - 1 ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex items-start justify-between pl-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' :
                        index === 1 ? 'bg-slate-200 text-slate-700 ring-1 ring-slate-300' :
                        index === 2 ? 'bg-orange-100 text-orange-800 ring-1 ring-orange-300' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
                          {dest.name}
                        </div>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          index === 0 
                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' 
                            : index === destinations.length - 1
                            ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                            : 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                        }`}>
                          {index === 0 ? 'Top Performer' : index === destinations.length - 1 ? 'Needs Focus' : 'Performing Well'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-blue-600 leading-none">{dest.count}</div>
                      <div className="text-xs font-bold text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded inline-block">{dest.percentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
