import React, { useEffect, useState } from "react";

const MyCards = () => {
  const [companies, setCompanies] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/company/all");
      const result = await response.json();
      console.log(result);

      // assuming result.companies is the array
      setCompanies(result.companies || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter active companies
  const activeCompanies = companies.filter(
    (company) => company.status?.toLowerCase() === "active"
  );

  return (
    <>
      {/* Total Companies */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-black text-xl font-semibold">Total Companies</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {companies.length}
        </div>
      </div>

      {/* Active Companies */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-black text-xl font-semibold">Active Companies</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {activeCompanies.length}
        </div>
      </div>
    </>
  );
};

export default MyCards;
