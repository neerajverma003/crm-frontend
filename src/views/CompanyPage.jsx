import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyPage = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const navigate = useNavigate();
  
  // Sample company data
  const companies = [
  { id: 1, name: 'Skyward Ventures', logo: '🚀', industry: 'Technology', color: 'from-blue-500 to-purple-600' },
  { id: 2, name: 'Flash Nomads', logo: '⚡', industry: 'Innovation', color: 'from-purple-500 to-pink-600' },
  { id: 3, name: 'DataPulse', logo: '📊', industry: 'Analytics', color: 'from-green-500 to-teal-600' },
  { id: 4, name: 'CloudTrail Journeys', logo: '☁️', industry: 'Cloud Services', color: 'from-blue-400 to-cyan-600' },
  { id: 5, name: 'AeroWave', logo: '🌐', industry: 'Networking', color: 'from-indigo-500 to-blue-500' },
  { id: 6, name: 'BrightBridge', logo: '🌟', industry: 'Consulting', color: 'from-yellow-400 to-orange-500' },
  // { id: 7, name: 'NeoVista', logo: '🔮', industry: 'AI & ML', color: 'from-pink-500 to-purple-500' },
]



  // Stagger animation effect
  useEffect(() => {
    companies.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index])
      }, index * 150)
    })
  }, [])

  // Handle card click to navigate to login page
  const handleCardClick = (company) => {
    navigate('/login', { state: { company } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Import Tailwind CSS directly */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
          Our Partners
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {companies.map((company, index) => (
          <div
            key={company.id}
            className={`transform transition-all duration-700 cursor-pointer ${
              visibleCards.includes(index) 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-20 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
            onClick={() => handleCardClick(company)}
          >
            <div className="group relative">
              {/* Main Card */}
              <div className={`
                relative overflow-hidden rounded-2xl bg-gradient-to-r ${company.color}
                p-1 transition-all duration-500 hover:scale-105 hover:rotate-1
                before:absolute before:inset-0 before:rounded-2xl 
                before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                before:-translate-x-full before:transition-transform before:duration-700
                hover:before:translate-x-full
              `}>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 h-48 flex flex-col justify-between">
                  {/* Floating Logo */}
                  <div className="relative">
                    <div className="text-6xl mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                      {company.logo}
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -top-2 -left-2 text-6xl opacity-30 blur-sm transition-opacity duration-500 group-hover:opacity-60">
                      {company.logo}
                    </div>
                  </div>
                  
                  {/* Company Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-yellow-300">
                      {company.name}
                    </h3>
                    <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white">
                      {company.industry}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-xl"></div>
                  
                  {/* Action Button (appears on hover) */}
                  <div className="absolute bottom-4 right-4 transform translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors cursor-pointer">
                      View Details
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-white rounded-full animate-ping`}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Animation */}
      {visibleCards.length < companies.length && (
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-white/60 mt-2 text-sm">Loading companies...</p>
        </div>
      )}

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-500/10 to-transparent rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 to-transparent rounded-full animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}}></div>
      </div>
    </div>
  )
}

export default CompanyPage