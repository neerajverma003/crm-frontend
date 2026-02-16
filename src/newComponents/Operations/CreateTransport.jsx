import React, { useState, useEffect } from "react";

const CreateTransport = () => {
  const [isDomestic, setIsDomestic] = useState(true);

  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [destination, setDestination] = useState("");

  const [transportName, setTransportName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [transportEmail, setTransportEmail] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");

  const [states, setStates] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [transports, setTransports] = useState([]);

  // ---------------------------- FETCH APIs ----------------------------
  const fetchStates = async () => {
    try {
      const res = await fetch("http://localhost:4000/state/");
      const data = await res.json();
      setStates(data);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:4000/destination/");
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const fetchTransports = async () => {
    try {
      const res = await fetch("http://localhost:4000/transport/");
      const data = await res.json();
      setTransports(data);
    } catch (err) {
      console.error("Error fetching transports:", err);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDestinations();
    fetchTransports();
  }, []);

  // ---------------------------- FILTERED DROPDOWNS ----------------------------
  const internationalCountries = [
    ...new Set(states.filter((s) => s.type === "International").map((s) => s.country)),
  ];

  const domesticStates = states.filter((s) => s.type === "Domestic");
  const internationalStates = states.filter(
    (s) => s.type === "International" && s.country === country
  );

  const filteredDestinations = destinations.filter((d) => d.state?._id === state);

  useEffect(() => {
    if (isDomestic) setCountry("India");
    else setCountry("");
    setState("");
    setDestination("");
  }, [isDomestic]);

  useEffect(() => {
    setState("");
    setDestination("");
  }, [country]);

  useEffect(() => {
    setDestination("");
  }, [state]);

  // ---------------------------- SUBMIT WITH POST API ----------------------------
  const handleSubmit = async () => {
    if (!state || !destination || !transportName || !phoneNumber || !whatsappNumber || !transportEmail || !contactPersonNumber) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      type: isDomestic ? "Domestic" : "International",
      country,
      state,
      destination,
      transportName,
      phoneNumber,
      whatsappNumber,
      transportEmail,
      contactPersonNumber,
    };

    try {
      const res = await fetch("http://localhost:4000/transport/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Transport created successfully!");
        console.log("Saved:", data);

        setTransportName("");
        setPhoneNumber("");
        setWhatsappNumber("");
        setTransportEmail("");
        setContactPersonNumber("");
        setState("");
        setDestination("");
        if (!isDomestic) setCountry("");

        fetchTransports();
      } else {
        alert(data.message || "Failed to create transport!");
      }
    } catch (error) {
      console.error("Error saving transport:", error);
      alert("Server error!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------------- CREATE TRANSPORT FORM ---------------------- */}
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="bg-white rounded-lg shadow-md p-8 w-full" style={{ maxWidth: "1000px" }}>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Transport</h1>

          {/* Domestic / International Toggle */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDomestic} onChange={(e) => setIsDomestic(e.target.checked)} />
              <span>Domestic</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!isDomestic} onChange={(e) => setIsDomestic(!e.target.checked)} />
              <span>International</span>
            </label>
          </div>

          {/* COUNTRY */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Country</label>
            {isDomestic ? (
              <input value="India" className="w-full border p-2 bg-gray-100 rounded-lg" disabled />
            ) : (
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2">
                <option value="">Select Country</option>
                {internationalCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* STATE */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2 rounded-lg">
              <option value="">Select State</option>
              {isDomestic
                ? domesticStates.map((s) => <option key={s._id} value={s._id}>{s.state}</option>)
                : internationalStates.map((s) => <option key={s._id} value={s._id}>{s.state}</option>)}
            </select>
          </div>

          {/* DESTINATION */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border p-2 rounded-lg">
              <option value="">Select Destination</option>
              {filteredDestinations.map((d) => (
                <option key={d._id} value={d._id}>{d.destinationName}</option>
              ))}
            </select>
          </div>

          {/* TRANSPORT NAME */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Transport Name</label>
            <input value={transportName} onChange={(e) => setTransportName(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Enter transport name" />
          </div>

          {/* PHONE NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Phone Number</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Enter phone number" />
          </div>

          {/* WHATSAPP NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">WhatsApp Number</label>
            <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Enter WhatsApp number" />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <input type="email" value={transportEmail} onChange={(e) => setTransportEmail(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Enter email address" />
          </div>

          {/* CONTACT PERSON NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Contact Person Number</label>
            <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Enter contact person number" />
          </div>

          <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Save Transport
          </button>
        </div>
      </div>

      {/* ---------------------- TRANSPORT LIST TABLE ---------------------- */}
      <div className="p-6 max-w-7xl mx-auto pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Transports</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Transport Name</th>
                  <th className="p-3 text-left font-semibold">Country</th>
                  <th className="p-3 text-left font-semibold">State</th>
                  <th className="p-3 text-left font-semibold">Destination</th>
                  <th className="p-3 text-left font-semibold">Phone Number</th>
                  <th className="p-3 text-left font-semibold">WhatsApp</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Contact Person</th>
                </tr>
              </thead>
              <tbody>
                {transports.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No transports found. Create your first transport above.
                    </td>
                  </tr>
                ) : (
                  transports.map((t, index) => (
                    <tr key={t._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border-b border-gray-200">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${t.type === "Domestic" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 font-medium text-gray-900">{t.transportName}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.country}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.state?.state || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.destination?.destinationName || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.phoneNumber}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.whatsappNumber}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.transportEmail}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{t.contactPersonNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransport;
