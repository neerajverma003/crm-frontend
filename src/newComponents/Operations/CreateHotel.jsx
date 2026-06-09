
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";

const CreateHotel = () => {
  const [isDomestic, setIsDomestic] = useState(true);
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [destination, setDestination] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelEmail, setHotelEmail] = useState("");
  const [hotelWhatsapp, setHotelWhatsapp] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [hotelRating, setHotelRating] = useState("");
  const [states, setStates] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [filterType, setFilterType] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [searchName, setSearchName] = useState("");

  const [editingHotelId, setEditingHotelId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [hotelImages, setHotelImages] = useState([]);
  const [editHotelImages, setEditHotelImages] = useState([]);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const [editFormData, setEditFormData] = useState({
    isDomestic: true,
    country: "India",
    state: "",
    destination: "",
    hotelName: "",
    hotelPhone: "",
    hotelAddress: "",
    hotelEmail: "",
    hotelWhatsapp: "",
    contactPersonNumber: "",
    hotelRating: ""
  });

  const fetchStates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/state/`);
      const data = await res.json();
      setStates(data);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/destination/`);
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/`);
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDestinations();
    fetchHotels();
  }, []);

  const internationalCountries = [
    ...new Set(states.filter(s => s.type === "International").map(s => s.country))
  ];

  const domesticStates = states.filter(s => s.type === "Domestic");
  const internationalStates = states.filter(
    (s) => s.type === "International" && s.country === country
  );

  const filteredDestinations = destinations.filter(
    (d) => d.state?._id === state
  );

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

  const clearForm = () => {
    setHotelName("");
    setHotelPhone("");
    setHotelAddress("");
    setHotelEmail("");
    setHotelWhatsapp("");
    setContactPersonNumber("");
    setHotelRating("");
    setState("");
    setDestination("");
    setHotelImages([]);
    if (!isDomestic) setCountry("");
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setHotelImages([...hotelImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setHotelImages(hotelImages.filter((_, i) => i !== index));
  };

  const handleEditImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setEditHotelImages([...editHotelImages, ...files]);
  };

  const handleRemoveEditImage = (index) => {
    setEditHotelImages(editHotelImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    if (!imageUrl) return;
    setImagesToRemove(prev => prev.includes(imageUrl) ? prev : [...prev, imageUrl]);
    setEditData(prev => ({
      ...prev,
      hotelImages: prev?.hotelImages?.filter(img => {
        const url = typeof img === 'string' ? img : img.url;
        return url !== imageUrl;
      }) || []
    }));
  };

  const handleSubmit = async () => {
    if (!state || !destination || !hotelName || !hotelPhone || !hotelAddress || !hotelEmail || !hotelWhatsapp || !contactPersonNumber  || !hotelRating) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("type", isDomestic ? "Domestic" : "International");
    formData.append("country", country);
    formData.append("state", state);
    formData.append("destination", destination);
    formData.append("hotelName", hotelName);
    formData.append("hotelPhone", hotelPhone);
    formData.append("hotelAddress", hotelAddress);
    formData.append("hotelEmail", hotelEmail);
    formData.append("whatsappNumber", hotelWhatsapp);
    formData.append("contactPersonNumber", contactPersonNumber);
    formData.append("rating", hotelRating);

    // Add images
    hotelImages.forEach((image, index) => {
      formData.append(`hotelImages`, image);
    });

    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create hotel!");
      alert("Hotel created successfully!");

      clearForm();
      fetchHotels();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert(error.message || "Server error!");
    }
  };

  const filteredHotels = hotels.filter((h) => {
    const matchType = filterType === "All" || h.type === filterType;
    const matchState = filterState === "All" || h.state?.state === filterState;
    const matchRating = filterRating === "All" || Number(h.rating) === Number(filterRating);
    const matchSearch = h.hotelName.toLowerCase().includes(searchName.toLowerCase());

    return matchType && matchState && matchRating && matchSearch;
  });

  const onView = async (hotelId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      const data = await res.json();
      console.log("Hotel view data:", data); // Debug log
      console.log("Hotel images:", data.hotelImages); // Debug log
      setViewData(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching hotel details");
    }
  };

  const onEdit = async (hotelId) => {
    setViewData(null);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel for edit");

      const data = await res.json();
      setEditData(data);
      setEditingHotelId(hotelId);

      setEditFormData({
        isDomestic: data.type === "Domestic",
        country: data.country || "",
        state: data.state?._id || "",
        destination: data.destination?._id || "",
        hotelName: data.hotelName || "",
        hotelPhone: data.hotelPhone || "",
        hotelAddress: data.hotelAddress || "",
        hotelEmail: data.hotelEmail || "",
        hotelWhatsapp: data.whatsappNumber || "",
        contactPersonNumber: data.contactPersonNumber || "",
        hotelRating: data.rating || ""
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching hotel for edit");
    }
  };

  const onDelete = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/delete/${hotelId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("Hotel deleted successfully!");
      fetchHotels();
    } catch (err) {
      console.error(err);
      alert("Error deleting hotel");
    }
  };

  const handleUpdateHotel = async () => {
    if (!editFormData.state || !editFormData.destination || !editFormData.hotelName || !editFormData.hotelPhone || !editFormData.hotelAddress || !editFormData.hotelEmail || !editFormData.hotelWhatsapp || !editFormData.contactPersonNumber || !editFormData.hotelRating) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("type", editFormData.isDomestic ? "Domestic" : "International");
    formData.append("country", editFormData.country);
    formData.append("state", editFormData.state);
    formData.append("destination", editFormData.destination);
    formData.append("hotelName", editFormData.hotelName);
    formData.append("hotelPhone", editFormData.hotelPhone);
    formData.append("hotelAddress", editFormData.hotelAddress);
    formData.append("hotelEmail", editFormData.hotelEmail);
    formData.append("whatsappNumber", editFormData.hotelWhatsapp);
    formData.append("contactPersonNumber", editFormData.contactPersonNumber);
    formData.append("rating", editFormData.hotelRating);

    // Add new images
    editHotelImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("hotelImages", image);
      }
    });

    // Include imagesToRemove so backend can delete them from Cloudinary and DB
    if (imagesToRemove && imagesToRemove.length > 0) {
      formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/update/${editingHotelId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Update local hotels state immediately so UI reflects changes without full reload
      setHotels(prev => prev.map(h => (h._id === data._id ? data : h)));
      // If a view modal for this hotel is open, refresh it
      if (viewData && viewData._id === data._id) setViewData(data);

      alert("Hotel updated successfully!");
      setEditData(null);
      setEditingHotelId(null);
      setEditHotelImages([]);
      setImagesToRemove([]);
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert(error.message || "Server error!");
    }
  };

  const filteredEditDestinations = destinations.filter(
    (d) => d.state?._id === editFormData.state
  );

  const editDomesticStates = states.filter(s => s.type === "Domestic");
  const editInternationalStates = states.filter(
    (s) => s.type === "International" && s.country === editFormData.country
  );

  return (
    <div className="max-w-6xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Create Hotel</h2>
            <p className="text-slate-500 font-medium mt-1">Manage domestic and international hotel listings</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* FORM SECTION */}
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
                Add New Hotel
              </h3>

              {/* Type Selection */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setIsDomestic(true)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    isDomestic
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  Domestic
                </button>
                <button
                  type="button"
                  onClick={() => setIsDomestic(false)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    !isDomestic
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  International
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                
                {/* COUNTRY */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Country</label>
                  {isDomestic ? (
                    <input value="India" readOnly className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed" />
                  ) : (
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800">
                      <option value="">Select Country</option>
                      {internationalCountries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* STATE */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">State</label>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800">
                    <option value="">Select State</option>
                    {isDomestic
                      ? domesticStates.map((s) => <option key={s._id} value={s._id}>{s.state}</option>)
                      : internationalStates.map((s) => <option key={s._id} value={s._id}>{s.state}</option>)}
                  </select>
                </div>

                {/* DESTINATION */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800">
                    <option value="">Select Destination</option>
                    {filteredDestinations.map((d) => <option key={d._id} value={d._id}>{d.destinationName}</option>)}
                  </select>
                </div>

                {/* HOTEL NAME */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hotel Name</label>
                  <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="e.g. The Taj Mahal Palace" className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800" />
                </div>

                {/* HOTEL PHONE */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hotel Phone</label>
                  <input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} placeholder="e.g. +91 9876543210" className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800" />
                </div>

                {/* WHATSAPP NUMBER */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">WhatsApp Number</label>
                  <input value={hotelWhatsapp} onChange={(e) => setHotelWhatsapp(e.target.value)} placeholder="e.g. +91 9876543210" className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800" />
                </div>

                {/* CONTACT PERSON NUMBER */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Contact Person Number</label>
                  <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} placeholder="e.g. +91 9876543210" className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800" />
                </div>

                {/* HOTEL EMAIL */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hotel Email</label>
                  <input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} placeholder="e.g. info@taj.com" className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800" />
                </div>

                {/* HOTEL RATING */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hotel Rating</label>
                  <select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800">
                    <option value="">Select Rating</option>
                    {[1,2,3,4,5,6,7].map(r => (
                      <option key={r} value={r}>{r} Star</option>
                    ))}
                  </select>
                </div>

                {/* HOTEL ADDRESS - Spans 2 columns on desktop */}
                <div className="w-full md:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Hotel Address</label>
                  <textarea value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} placeholder="Full street address..." className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 h-24 resize-none"></textarea>
                </div>

                {/* UPLOAD IMAGES - Spans 1 column on desktop, next to address */}
                <div className="w-full md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Upload Hotel Images</label>
                  <div className="w-full relative border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-colors p-4 flex flex-col items-center justify-center text-center h-24 cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-xs font-bold text-slate-500">Click to upload</span>
                  </div>
                </div>

                {/* IMAGE PREVIEWS */}
                {hotelImages.length > 0 && (
                  <div className="w-full md:col-span-2 lg:col-span-3 mt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Selected Images ({hotelImages.length})</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {hotelImages.map((image, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBMIT BUTTON - Spans full width */}
                <div className="w-full md:col-span-2 lg:col-span-3 mt-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex justify-center items-center gap-2"
                  >
                    Save Hotel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------- HOTEL LIST ------------------------- */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
                All Hotels
              </h3>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <select className="border-2 border-slate-200 px-4 py-2 rounded-xl bg-white text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-400" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
              <select className="border-2 border-slate-200 px-4 py-2 rounded-xl bg-white text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-400" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                <option value="All">All States</option>
                {[...new Set(hotels.map(h => h.state?.state))].map((st, idx) => st && <option key={idx} value={st}>{st}</option>)}
              </select>
              <select className="border-2 border-slate-200 px-4 py-2 rounded-xl bg-white text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-400" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                <option value="All">All Ratings</option>
                {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r} ⭐</option>)}
              </select>
              <div className="flex-1 min-w-[200px]">
                <input type="text" placeholder="Search hotel name..." className="w-full border-2 border-slate-200 px-4 py-2 rounded-xl bg-white text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-400" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
              </div>
            </div>

            {/* TABLE */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 md:bg-white">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Hotel Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHotels.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-slate-500 font-bold">
                          <div className="flex justify-center mb-2">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          </div>
                          No hotels found.
                        </td>
                      </tr>
                    ) : (
                      filteredHotels.map((h, index) => (
                        <tr key={h._id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-blue-900">{h.hotelName}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              h.type === 'Domestic' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {h.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{h.state?.state || "N/A"}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{h.destination?.destinationName || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-700">{h.hotelPhone}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{h.hotelEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {h.rating ? `${h.rating} ⭐` : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button className="p-2 rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors" onClick={() => onView(h._id)} title="View"><Eye size={16} strokeWidth={2.5} /></button>
                              <button className="p-2 rounded-lg bg-slate-50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 transition-colors" onClick={() => onEdit(h._id)} title="Edit"><Edit size={16} strokeWidth={2.5} /></button>
                              <button className="p-2 rounded-lg bg-slate-50 text-red-500 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors" onClick={() => onDelete(h._id)} title="Delete"><Trash2 size={16} strokeWidth={2.5} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="flex flex-col gap-4 p-4">
                  {filteredHotels.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 font-bold bg-white rounded-xl border border-slate-200 shadow-sm">No hotels found.</div>
                  ) : (
                    filteredHotels.map((h, index) => (
                      <div key={h._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-blue-900 text-base">{h.hotelName}</h4>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              h.type === 'Domestic' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {h.type}
                            </span>
                          </div>
                          <span className="px-2 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {h.rating ? `${h.rating} ⭐` : "N/A"}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Location</p>
                            <p className="font-semibold text-slate-800">{h.state?.state || "N/A"}</p>
                            <p className="text-xs text-slate-500">{h.destination?.destinationName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Contact</p>
                            <p className="font-semibold text-slate-800">{h.hotelPhone}</p>
                            <p className="text-xs text-slate-500 truncate" title={h.hotelEmail}>{h.hotelEmail}</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-100">
                          <button className="p-2.5 rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-100 border border-slate-200" onClick={() => onView(h._id)}><Eye size={16} /></button>
                          <button className="p-2.5 rounded-lg bg-slate-50 text-amber-600 hover:bg-amber-100 border border-slate-200" onClick={() => onEdit(h._id)}><Edit size={16} /></button>
                          <button className="p-2.5 rounded-lg bg-slate-50 text-red-500 hover:bg-red-100 border border-slate-200" onClick={() => onDelete(h._id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal - Centered on Screen */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 sm:p-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl relative max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => {
                setViewData(null);
                setImageLoadErrors({});
                setImageLoading({});
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
              aria-label="Close view modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shrink-0">
              <h2 className="text-2xl sm:text-3xl font-bold">{viewData.hotelName}</h2>
              <p className="text-slate-300 text-sm mt-1">Hotel Information</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Hotel Images Section */}
              {viewData.hotelImages && viewData.hotelImages.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {viewData.hotelImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={typeof image === 'string' ? image : image.url} 
                          alt={`Hotel ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 bg-white"
                          onError={() => {
                            console.error(`Image ${index} failed to load:`, image);
                            setImageLoadErrors({...imageLoadErrors, [`image-${index}`]: true});
                          }}
                          onLoad={() => {
                            const url = typeof image === 'string' ? image : image.url;
                            console.log(`Image ${index} loaded successfully:`, url);
                            setImageLoading({...imageLoading, [`image-${index}`]: false});
                          }}
                        />
                        {imageLoadErrors[`image-${index}`] && (
                          <div className="absolute inset-0 bg-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-gray-600 text-xs">Failed to load</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-sm">No images available for this hotel.</p>
                </div>
              )}

              {/* Location Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="text-gray-900 font-semibold mt-1">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${viewData.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {viewData.type}
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Country</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.country || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">State</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.state?.state || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Destination</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.destination?.destinationName || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.hotelPhone || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 font-semibold mt-1 break-words">{viewData.hotelEmail || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">WhatsApp Number</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.whatsappNumber || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Contact Person</p>
                    <p className="text-gray-900 font-semibold mt-1">{viewData.contactPersonNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Address & Rating */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-600 rounded-full"></span>
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-gray-900 font-semibold mt-2 whitespace-pre-wrap">{viewData.hotelAddress || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Hotel Rating</p>
                    <p className="text-gray-900 font-semibold mt-2">
                      <span className="inline-block px-3 py-1 rounded text-lg font-bold bg-yellow-100 text-yellow-700">
                        {viewData.rating ? `${viewData.rating} ⭐` : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 flex justify-end">
              <button
                onClick={() => {
                  setViewData(null);
                  setImageLoadErrors({});
                  setImageLoading({});
                }}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Centered on Screen */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 sm:p-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl relative max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
            <button
              onClick={() => {
                setEditData(null);
                setEditingHotelId(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              aria-label="Close edit modal"
            >
              &times;
            </button>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shrink-0 rounded-t-2xl">
              <h3 className="text-2xl font-bold">Edit Hotel</h3>
              <p className="text-slate-300 text-sm mt-1">Update hotel information</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Domestic / International Toggle */}
              <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editFormData.isDomestic} 
                  onChange={(e) => setEditFormData({...editFormData, isDomestic: e.target.checked, country: e.target.checked ? "India" : "", state: "", destination: ""})} 
                />
                <span>Domestic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!editFormData.isDomestic} 
                  onChange={(e) => setEditFormData({...editFormData, isDomestic: !e.target.checked, country: !e.target.checked ? "India" : "", state: "", destination: ""})} 
                />
                <span>International</span>
              </label>
            </div>

            {/* COUNTRY */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Country</label>
              {editFormData.isDomestic ? (
                <input value="India" className="w-full border p-2 bg-gray-100" disabled />
              ) : (
                <select value={editFormData.country} onChange={(e) => setEditFormData({...editFormData, country: e.target.value, state: "", destination: ""})} className="w-full border p-2">
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
              <select value={editFormData.state} onChange={(e) => setEditFormData({...editFormData, state: e.target.value, destination: ""})} className="w-full border p-2">
                <option value="">Select State</option>
                {editFormData.isDomestic
                  ? editDomesticStates.map((s) => (
                      <option key={s._id} value={s._id}>{s.state}</option>
                    ))
                  : editInternationalStates.map((s) => (
                      <option key={s._id} value={s._id}>{s.state}</option>
                    ))}
              </select>
            </div>

            {/* DESTINATION */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Destination</label>
              <select value={editFormData.destination} onChange={(e) => setEditFormData({...editFormData, destination: e.target.value})} className="w-full border p-2">
                <option value="">Select Destination</option>
                {filteredEditDestinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.destinationName}</option>
                ))}
              </select>
            </div>

            {/* HOTEL NAME */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Name</label>
              <input value={editFormData.hotelName} onChange={(e) => setEditFormData({...editFormData, hotelName: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL PHONE */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Phone</label>
              <input value={editFormData.hotelPhone} onChange={(e) => setEditFormData({...editFormData, hotelPhone: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL ADDRESS */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Address</label>
              <textarea value={editFormData.hotelAddress} onChange={(e) => setEditFormData({...editFormData, hotelAddress: e.target.value})} className="w-full border p-2" rows="3"></textarea>
            </div>

            {/* HOTEL EMAIL */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Email</label>
              <input type="email" value={editFormData.hotelEmail} onChange={(e) => setEditFormData({...editFormData, hotelEmail: e.target.value})} className="w-full border p-2" />
            </div>

            {/* WHATSAPP NUMBER */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">WhatsApp Number</label>
              <input value={editFormData.hotelWhatsapp} onChange={(e) => setEditFormData({...editFormData, hotelWhatsapp: e.target.value})} className="w-full border p-2" />
            </div>

            {/* CONTACT PERSON NUMBER */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Contact Person Number</label>
              <input value={editFormData.contactPersonNumber} onChange={(e) => setEditFormData({...editFormData, contactPersonNumber: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL RATING */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Rating</label>
              <select value={editFormData.hotelRating} onChange={(e) => setEditFormData({...editFormData, hotelRating: e.target.value})} className="w-full border p-2">
                <option value="">Select Rating</option>
                {[1,2,3,4,5,6,7].map(r => (
                  <option key={r} value={r}>{r} Star</option>
                ))}
              </select>
            </div>

            {/* UPLOAD HOTEL IMAGES */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Hotel Images <span className="text-gray-500 text-sm">(Optional)</span></label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleEditImageSelect}
                className="w-full border p-2"
              />
              {editHotelImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">New Images ({editHotelImages.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {editHotelImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {editData?.hotelImages && editData.hotelImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Existing Images ({editData.hotelImages.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {editData.hotelImages && editData.hotelImages.map((img, idx) => {
                      const url = typeof img === 'string' ? img : img.url;
                      return (
                        <div key={idx} className="relative group">
                          <img 
                            src={url} 
                            alt={`Existing ${idx}`} 
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove existing image"
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 flex gap-3">
              <button
                onClick={handleUpdateHotel}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Update Hotel
              </button>
              <button
                onClick={() => {
                  setEditData(null);
                  setEditingHotelId(null);
                  setEditHotelImages([]);
                }}
                className="px-6 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateHotel;