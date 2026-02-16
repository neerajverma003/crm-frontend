import React, { useState, useEffect } from "react";
import { MapPin, Calendar, FileText, Loader2, Download } from "lucide-react";

export default function AllItinerary() {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItinerary, setSelectedItinerary] = useState(null); // selected itinerary to show details
      const [activeTab, setActiveTab] = useState('domestic'); // 'domestic' or 'international'
    

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:4000/itinerary/");
            if (!response.ok) throw new Error("Failed to fetch itineraries");
            const result = await response.json();
            if (result.success && result.data) {
                // Group itineraries by Destination to merge Upload arrays
                const grouped = result.data.reduce((acc, curr) => {
                    const found = acc.find((item) => item.Destination === curr.Destination);
                    if (found) {
                        found.Upload = [...found.Upload, ...curr.Upload];
                        found.NoOfDay = Math.max(found.NoOfDay, curr.NoOfDay);
                        // Optionally update createdAt to earliest/latest date as needed
                    } else {
                        acc.push({ ...curr, Upload: [...curr.Upload] });
                    }
                    return acc;
                }, []);
                setItineraries(grouped);
            } else {
                throw new Error("Invalid data format");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url, destination, index) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${destination}_Itinerary_${index + 1}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600" />
                    <p className="text-lg text-gray-600">Loading itineraries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center text-red-600">
                        <FileText className="mr-2 h-6 w-6" />
                        <h2 className="text-xl font-semibold">Error Loading Itineraries</h2>
                    </div>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchItineraries}
                        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If an itinerary is selected, show its PDFs with Back button
    if (selectedItinerary) {
        return (
            <div className="mx-auto min-h-screen max-w-4xl bg-gray-50 p-8">
                <button
                    onClick={() => setSelectedItinerary(null)}
                    className="mb-6 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                    ← Back to Itineraries
                </button>

                <h1 className="mb-6 text-3xl font-bold text-gray-900">{selectedItinerary.Destination} Itineraries</h1>

                <div className="space-y-4">
                    {selectedItinerary.Upload.map((pdfUrl, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between rounded bg-white p-4 shadow"
                        >
                            <span className="truncate font-semibold">{`Itinerary PDF ${idx + 1}`}</span>
                            <button
                                onClick={() => handleDownload(pdfUrl, selectedItinerary.Destination, idx)}
                                className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                <Download className="h-5 w-5" /> Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Show list of grouped itineraries
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-4xl font-bold text-gray-800">Travel Itineraries</h1>
                    <p className="text-lg text-gray-600">Explore our curated travel plans and download your perfect itinerary</p>
                </div>

                <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('domestic')}
                className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === 'domestic' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
              >
                Domestic
              </button>
              <button
                onClick={() => setActiveTab('international')}
                className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === 'international' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
              >
                International
              </button>
            </div>
          </div>

                {itineraries.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow-lg">
                        <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-xl text-gray-600">No itineraries available yet</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {itineraries.filter((itinerary) => itinerary.TravelType === activeTab).map((itinerary) => (
                            <div
                                key={itinerary._id}
                                onClick={() => setSelectedItinerary(itinerary)}
                                className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="p-6">
                                    <div className="mb-4 flex items-center space-x-2">
                                        <MapPin className="h-6 w-6 text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-800">{itinerary.Destination}</h2>
                                    </div>

                                    <div className="mb-6 flex items-center text-gray-600">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        <span className="text-sm">
                                            {itinerary.NoOfDay} {itinerary.NoOfDay === 1 ? "Day" : "Days"}
                                        </span>
                                    </div>

                                    <div className="mt-4 text-center text-xs text-gray-500">
                                        Added on {new Date(itinerary.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
