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
      const res = await fetch("http://localhost:4000/state/");
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
      const res = await fetch("http://localhost:4000/destination/");
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
      const res = await fetch("http://localhost:4000/destination/", {
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
    <div className="max-w-7xl mx-auto mt-1 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-left">
        Create Destination
      </h2>

      {/* Type */}
      <div className="flex gap-6 mb-6 justify-left">
        <label className="flex items-left gap-2">
          <input
            type="checkbox"
            checked={destinationType === "Domestic"}
            onChange={() => handleCheckboxChange("Domestic")}
          />
          Domestic
        </label>

        <label className="flex items-left gap-2">
          <input
            type="checkbox"
            checked={destinationType === "International"}
            onChange={() => handleCheckboxChange("International")}
          />
          International
        </label>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-7xl ">

        {/* ========== COUNTRY ========== */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country Name
          </label>

          {destinationType === "Domestic" ? (
            <input
              type="text"
              value="India"
              readOnly
              className="w-full  border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none"
            />
          ) : (
            <select
              name="countryName"
              value={formData.countryName}
              onChange={handleInputChange}
              className="w-full  border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none"
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

        {/* ========== STATE ========== */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>

          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none"
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Destination Name
          </label>
          <input
            type="text"
            name="destinationName"
            value={formData.destinationName}
            onChange={handleInputChange}
            className="w-full  border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none"
            placeholder="Enter destination"
          />
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white py-2 rounded-md mt-5">
          Save Destination
        </button>
      </form>

      {/* TABLE */}
      <div className="mt-8">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-semibold flex justify-between items-center mb-4">Destination List</h3>

          <div className="flex gap-3 py-1 mb-4 ml-auto">
            {["All", "Domestic", "International"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1 border rounded ${
                  filterType === type ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Destination</th>
            </tr>
          </thead>

          <tbody>
            {filteredTable.map((d, index) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{d.type}</td>
                <td className="border p-2">{d.country}</td>
                <td className="border p-2">{d.state?.state}</td>
                <td className="border p-2">{d.destinationName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateDestination;
