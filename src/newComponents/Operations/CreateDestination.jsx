import React, { useEffect, useState } from "react";

const CreateDestination = () => {
  const [destinationType, setDestinationType] = useState("Domestic");
  const [formData, setFormData] = useState({
    countryName: "India",
    state: "",
    destinationName: "",
  });

  const [statesList, setStatesList] = useState([]);       
  const [destinations, setDestinations] = useState([]);  
  const [filterType, setFilterType] = useState("All");

  // -------------------------------------------------------------------
  // ✅ Fetch States from API
  // -------------------------------------------------------------------
  const fetchStates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/state/`);
      const data = await res.json();
      setStatesList(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // -------------------------------------------------------------------
  // ✅ Fetch Destinations
  // -------------------------------------------------------------------
  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/destination/`);
      const data = await res.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDestinations();
  }, []);

  // -------------------------------------------------------------------
  // ✅ Filter Domestic & International States
  // -------------------------------------------------------------------
  const domesticStates = statesList.filter((s) => s.type === "Domestic");
  const internationalStates = statesList.filter((s) => s.type === "International");

  // Extract unique countries for International dropdown
  const uniqueCountries = [
    ...new Set(internationalStates.map((s) => s.country)),
  ];

  // States filtered based on selected country
  const internationalStatesByCountry = internationalStates.filter(
    (s) => s.country === formData.countryName
  );

  // -------------------------------------------------------------------
  // Input change handler
  // -------------------------------------------------------------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // if country changes → reset state
    if (e.target.name === "countryName") {
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  };

  // -------------------------------------------------------------------
  // On Domestic / International toggle
  // -------------------------------------------------------------------
  const handleCheckboxChange = (type) => {
    setDestinationType(type);
    setFormData({
      countryName: type === "Domestic" ? "India" : "",
      state: "",
      destinationName: "",
    });
  };

  // -------------------------------------------------------------------
  // Save Destination API
  // -------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.countryName || !formData.state || !formData.destinationName) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      type: destinationType,
      country: formData.countryName,
      state: formData.state, 
      destinationName: formData.destinationName,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/destination/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save destination");

      alert("Destination saved successfully ✅");

      fetchDestinations();

      setFormData({
        countryName: destinationType === "Domestic" ? "India" : "",
        state: "",
        destinationName: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save destination");
    }
  };

  // Filter table
  const filteredTable =
    filterType === "All"
      ? destinations
      : destinations.filter((d) => d.type === filterType);

  return (
    <div className="max-w-6xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Create Destination</h2>
            <p className="text-slate-500 font-medium mt-1">Manage domestic and international destinations for operations</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* FORM SECTION */}
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Destination
              </h3>

              {/* Type Selection */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handleCheckboxChange("Domestic")}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    destinationType === "Domestic"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  Domestic
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckboxChange("International")}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    destinationType === "International"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  International
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                {/* COUNTRY */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Country Name</label>
                  {destinationType === "Domestic" ? (
                    <input
                      type="text"
                      value="India"
                      readOnly
                      className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed"
                    />
                  ) : (
                    <select
                      name="countryName"
                      value={formData.countryName}
                      onChange={handleInputChange}
                      className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
                    >
                      <option value="">Select Country</option>
                      {uniqueCountries.map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* STATE */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
                  >
                    <option value="">Select State</option>
                    {destinationType === "Domestic"
                      ? domesticStates.map((s) => (
                          <option value={s._id} key={s._id}>
                            {s.state}
                          </option>
                        ))
                      : internationalStatesByCountry.map((s) => (
                          <option value={s._id} key={s._id}>
                            {s.state}
                          </option>
                        ))}
                  </select>
                </div>

                {/* DESTINATION NAME */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Destination Name</label>
                  <input
                    type="text"
                    name="destinationName"
                    value={formData.destinationName}
                    onChange={handleInputChange}
                    className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
                    placeholder="Enter destination"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex justify-center items-center gap-2"
                  >
                    Save Destination
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* LIST SECTION */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Destination List
              </h3>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {["All", "Domestic", "International"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors flex-1 sm:flex-none ${
                      filterType === f
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                        : "bg-slate-50 text-slate-500 border-2 border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredTable.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-slate-500 font-bold text-lg">No destinations found</p>
                <p className="text-slate-400 text-sm mt-1">Add a new destination using the form above.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 w-16">#</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4">Destination</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTable.map((d, index) => (
                        <tr key={d._id || index} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-400">{index + 1}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                              d.type === 'Domestic' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {d.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
                              {d.country === 'India' ? '🇮🇳' : '🌍'} {d.country}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-700">{d.state?.state}</td>
                          <td className="px-6 py-4 font-bold text-blue-900 text-base">{d.destinationName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredTable.map((d, index) => (
                    <div key={d._id || index} className="p-4 flex flex-col gap-2 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-bold text-slate-400">#{index + 1}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          d.type === 'Domestic' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {d.type}
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                           {d.country === 'India' ? '🇮🇳' : '🌍'} {d.country} &bull; {d.state?.state}
                        </div>
                        <div className="text-lg font-black text-slate-800">{d.destinationName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDestination;
