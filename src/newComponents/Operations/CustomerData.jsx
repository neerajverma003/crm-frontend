import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/customer/all');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : (data.data || []));
      setError('');
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoc = (file) => {
    if (!file) {
      console.warn('File is null or undefined');
      return;
    }
    console.log('Viewing file:', file);
    setViewingFile(file);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`http://localhost:4000/customer/${customerId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCustomers();
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading customers...</div>;
 console.log(selectedCustomer);
 
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Data</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer List */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Customers ({customers.length})</h2>
          {customers.length === 0 ? (
            <p className="text-gray-500">No customers yet</p>
          ) : (
            <div className="space-y-2">
              {customers.map(customer => (
                <button
                  key={customer._id}
                  
                  onClick={() => setSelectedCustomer(customer)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedCustomer?._id === customer._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                >
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-sm">{customer.groupNo || 'No Group'}</div>
                  {customer.email && <div className="text-xs text-gray-600">{customer.email}</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="md:col-span-2 border rounded-lg p-6 bg-white">
          {selectedCustomer ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                  {/* <button
                    onClick={() => handleDeleteCustomer(selectedCustomer._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button> */}
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 font-semibold">Name</label>
                  <p className="text-lg">{selectedCustomer.name}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Phone</label>
                  <p className="text-lg">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Email</label>
                  <p className="text-lg">{selectedCustomer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Group No</label>
                  <p className="text-lg">{selectedCustomer.groupNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">WhatsApp No</label>
                  <p className="text-lg">{selectedCustomer.whatsAppNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Destination</label>
                  <p className="text-lg">{selectedCustomer.destination || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Departure City</label>
                  <p className="text-lg">{selectedCustomer.departureCity || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Expected Travel Date</label>
                  <p className="text-lg">
                    {selectedCustomer.expectedTravelDate
                      ? new Date(selectedCustomer.expectedTravelDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Days</label>
                  <p className="text-lg">{selectedCustomer.noOfDays || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Person</label>
                  <p className="text-lg">{selectedCustomer.noOfPerson || 0}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Child</label>
                  <p className="text-lg">{selectedCustomer.noOfChild || 0}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Lead Type</label>
                  <p className="text-lg">{selectedCustomer.leadType || 'N/A'}</p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="mt-6">
                  <label className="text-gray-600 font-semibold">Notes</label>
                  <p className="text-lg bg-gray-100 p-3 rounded">{selectedCustomer.notes}</p>
                </div>
              )} */}

              {/* Contact/Company Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  {selectedCustomer.companyName ? "Company Information" : "Contact Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedCustomer.companyName ? "Company Name" : "Full Name"}</label>
                    <input type="text" value={selectedCustomer.companyName || selectedCustomer.name || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedCustomer.companyName ? "Company Email" : "Email"}</label>
                    <input type="email" value={selectedCustomer.email || selectedCustomer.companyEmail || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedCustomer.companyName ? "Company Phone" : "Phone"}</label>
                    <input type="text" value={selectedCustomer.phone || selectedCustomer.companyPhone || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedCustomer.companyName ? "Company WhatsApp" : "WhatsApp"}</label>
                    <input type="text" value={selectedCustomer.whatsAppNo || selectedCustomer.companyWhatsApp || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Travel Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  Travel Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Departure City</label>
                    <input type="text" value={selectedCustomer.departureCity || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                    <input type="text" value={selectedCustomer.destination || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expected Travel Date</label>
                    <input type="text" value={selectedCustomer.expectedTravelDate ? new Date(selectedCustomer.expectedTravelDate).toLocaleDateString() : ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Days</label>
                    <input type="text" value={selectedCustomer.noOfDays || selectedCustomer.customNoOfDays || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  {(selectedCustomer.placesToCoverArray?.length > 0 || selectedCustomer.placesToCover) && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Places to Cover</label>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCustomer.placesToCoverArray || (selectedCustomer.placesToCover ? selectedCustomer.placesToCover.split(",") : [])).map((place, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                            {place?.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Passengers Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  Passengers Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Persons</label>
                    <input type="text" value={selectedCustomer.noOfPerson || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Children</label>
                    <input type="text" value={selectedCustomer.noOfChild || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Child Ages</label>
                    <input type="text" value={(selectedCustomer.childAges && selectedCustomer.childAges.length ? selectedCustomer.childAges.join(", ") : "-")} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Lead Management Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                  Lead Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Group Number</label>
                    <input type="text" value={selectedCustomer.groupNumber || selectedCustomer.groupNo || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Status</label>
                    <input type="text" value={selectedCustomer.leadStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Source</label>
                    <input type="text" value={selectedCustomer.leadSource || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Type</label>
                    <input type="text" value={selectedCustomer.leadType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Trip Type</label>
                    <input type="text" value={selectedCustomer.tripType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedCustomer.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                    Additional Notes
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <textarea rows={3} value={selectedCustomer.notes} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              )}

              {/* Messages Section */}
              {selectedCustomer.messages && selectedCustomer.messages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Messages
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 max-h-64 overflow-y-auto">
                    {selectedCustomer.messages.map((msg, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className="text-xs text-gray-500 mb-1">
                          {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : "No date"}
                        </div>
                        <div className="text-sm text-gray-800 whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Details Section */}
              {(selectedCustomer.itinerary || selectedCustomer.inclusion || selectedCustomer.exclusion || selectedCustomer.totalAmount) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    Trip Details
                  </h4>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {/* Itinerary PDF */}
                    {selectedCustomer.itinerary && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Itinerary</label>
                        <button
                          type="button"
                          onClick={() => handleViewDoc({ name: 'Itinerary', url: selectedCustomer.itinerary, fileType: 'application/pdf', isExisting: true })}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                        >
                          📄 View Itinerary PDF
                        </button>
                      </div>
                    )}

                    {/* Inclusions */}
                    {selectedCustomer.inclusion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Inclusions</label>
                        <textarea rows={3} value={selectedCustomer.inclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Special Inclusions */}
                    {selectedCustomer.specialInclusions && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Special Inclusions</label>
                        <textarea rows={2} value={selectedCustomer.specialInclusions} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Exclusions */}
                    {selectedCustomer.exclusion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Exclusions</label>
                        <textarea rows={3} value={selectedCustomer.exclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Land Package Calculation */}
                    {selectedCustomer.totalAmount && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Cost:</span>
                            <span className="font-medium">₹ {selectedCustomer.totalAmount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Advance:</span>
                            <span className="font-medium">₹ {selectedCustomer.advanceRequired || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Discount:</span>
                            <span className="font-medium">₹ {selectedCustomer.discount || 0}</span>
                          </div>
                          <div className="border-t border-blue-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Final:</span>
                            <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(selectedCustomer.totalAmount || 0) - parseFloat(selectedCustomer.advanceRequired || 0) - parseFloat(selectedCustomer.discount || 0)).toFixed(2))}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Airfare Calculation */}
                    {selectedCustomer.totalAirfare && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Airfare Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Cost:</span>
                            <span className="font-medium">₹ {selectedCustomer.totalAirfare || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Advance:</span>
                            <span className="font-medium">₹ {selectedCustomer.advanceAirfare || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Discount:</span>
                            <span className="font-medium">₹ {selectedCustomer.discountAirfare || 0}</span>
                          </div>
                          <div className="border-t border-green-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Final:</span>
                            <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(selectedCustomer.totalAirfare || 0) - parseFloat(selectedCustomer.advanceAirfare || 0) - parseFloat(selectedCustomer.discountAirfare || 0)).toFixed(2))}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overall Calculation */}
                    {(selectedCustomer.totalAmount || selectedCustomer.totalAirfare) && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Grand Total Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Land Package:</span>
                            <span className="font-medium">₹ {parseFloat(selectedCustomer.totalAmount || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Airfare:</span>
                            <span className="font-medium">₹ {parseFloat(selectedCustomer.totalAirfare || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                            <span>Combined:</span>
                            <span className="text-purple-700">₹ {(parseFloat(selectedCustomer.totalAmount || 0) + parseFloat(selectedCustomer.totalAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Total Advance:</span>
                            <span className="font-medium">₹ {(parseFloat(selectedCustomer.advanceRequired || 0) + parseFloat(selectedCustomer.advanceAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Total Discount:</span>
                            <span className="font-medium">₹ {(parseFloat(selectedCustomer.discount || 0) + parseFloat(selectedCustomer.discountAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-purple-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                            <span className="font-bold text-purple-700">₹ {(Math.max(0, (parseFloat(selectedCustomer.totalAmount || 0) + parseFloat(selectedCustomer.totalAirfare || 0)) - (parseFloat(selectedCustomer.advanceRequired || 0) + parseFloat(selectedCustomer.advanceAirfare || 0)) - (parseFloat(selectedCustomer.discount || 0) + parseFloat(selectedCustomer.discountAirfare || 0)))).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {selectedCustomer.documents && selectedCustomer.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Documents</h3>
                  <div className="space-y-2">
                    {selectedCustomer.documents.map((doc, idx) => (
                      <div key={idx} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{doc.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {doc.personName} - {doc.documentType}
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-2"
                        >
                          <FaEye /> View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerData;