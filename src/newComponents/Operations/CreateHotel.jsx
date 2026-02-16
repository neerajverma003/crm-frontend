
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

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:4000/hotel/");
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
      hotelImages: prev?.hotelImages?.filter(img => img !== imageUrl) || []
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
      let res = await fetch("http://localhost:4000/hotel/", {
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
      const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
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
      const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
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
      const res = await fetch(`http://localhost:4000/hotel/delete/${hotelId}`, {
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
      const res = await fetch(`http://localhost:4000/hotel/update/${editingHotelId}`, {
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
    <div className="min-h-screen bg-gray-50">

      {/* ------------------------- HOTEL CREATE / EDIT FORM ------------------------- */}
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="bg-white rounded-lg shadow-md p-8 w-full" style={{maxWidth: '1000px'}}>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Hotel</h1>

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
              <input value="India" className="w-full border p-2 bg-gray-100 rounded-md" disabled />
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
                ? domesticStates.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))
                : internationalStates.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))}
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

          {/* HOTEL NAME */}
          <div className="mb-4">
            <label className="block mb-2 font-medium ">Hotel Name</label>
            <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>

          {/* HOTEL PHONE */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Phone</label>
            <input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>

          {/* HOTEL ADDRESS */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Address</label>
            <textarea value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} className="w-full border p-2 rounded-lg h-[100px] resize-none" rows="3"></textarea>
          </div>

          {/* HOTEL EMAIL */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Email</label>
            <input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>

          {/* WHATSAPP NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">WhatsApp Number</label>
            <input value={hotelWhatsapp} onChange={(e) => setHotelWhatsapp(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>

          {/* CONTACT PERSON NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Contact Person Number</label>
            <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>

          {/* HOTEL RATING */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Rating</label>
            <select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="w-full border p-2 rounded-lg">
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
              onChange={handleImageSelect}
              className="w-full border p-2 rounded-lg cursor-pointer"
            />
            {hotelImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected Images ({hotelImages.length}):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {hotelImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Save Hotel
          </button>
        </div>
      </div>

      {/* ------------------------- HOTEL LIST ------------------------- */}
      <div className="p-6 max-w-7xl mx-auto pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Hotels</h2>

          {/* FILTER BAR */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select className="border px-3 py-2 rounded" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
            <select className="border px-3 py-2 rounded" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="All">All States</option>
              {[...new Set(hotels.map(h => h.state?.state))].map((st, idx) => st && <option key={idx} value={st}>{st}</option>)}
            </select>
            <select className="border px-3 py-2 rounded" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="All">All Ratings</option>
              {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r} ⭐</option>)}
            </select>
            <input type="text" placeholder="Search hotel..." className="border px-3 py-2 rounded" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="p-3 text-left font-semibold">Hotel Name</th>
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">State</th>
                  <th className="p-3 text-left font-semibold">Destination</th>
                  <th className="p-3 text-left font-semibold">Phone</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">WhatsApp</th>
                  <th className="p-3 text-left font-semibold">Rating</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">No hotels found.</td>
                  </tr>
                ) : (
                  filteredHotels.map((h, index) => (
                    <tr key={h._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border-b border-gray-200 font-medium text-gray-900">{h.hotelName}</td>
                      <td className="p-3 border-b border-gray-200">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${h.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{h.type}</span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.state?.state || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.destination?.destinationName || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelPhone}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelEmail}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.whatsappNumber || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200"><span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">{h.rating ? `${h.rating} ⭐` : "N/A"}</span></td>
                      <td className="p-3 border-b border-gray-200 text-gray-700 flex gap-3">
                        <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => onView(h._id)}><Eye size={18} /></button>
                        <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" onClick={() => onEdit(h._id)}><Edit size={18} /></button>
                        <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => onDelete(h._id)}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* View Modal - Centered on Screen */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative max-h-screen overflow-y-auto">
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
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
              <h2 className="text-3xl font-bold">{viewData.hotelName}</h2>
              <p className="text-gray-300 text-sm mt-1">Hotel Information</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Hotel Images Section */}
              {viewData.hotelImages && viewData.hotelImages.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {viewData.hotelImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Hotel ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-300 bg-white"
                          onError={() => {
                            console.error(`Image ${index} failed to load:`, image);
                            setImageLoadErrors({...imageLoadErrors, [`image-${index}`]: true});
                          }}
                          onLoad={() => {
                            console.log(`Image ${index} loaded successfully:`, image);
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
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white border rounded-lg shadow-lg p-6 relative max-h-screen overflow-y-auto m-4">
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

            <h3 className="text-xl font-bold mb-4">Edit Hotel</h3>
            
            {/* Domestic / International Toggle */}
            <div className="flex items-center gap-6 mb-4">
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
                    {editData.hotelImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-20 cursor-pointer shadow"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateHotel}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                Update Hotel
              </button>
              <button
                onClick={() => {
                  setEditData(null);
                  setEditingHotelId(null);
                  setEditHotelImages([]);
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition">
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