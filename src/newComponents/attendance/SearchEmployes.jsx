import { useState } from "react";

const SearchEmployes = ({ setSearchText }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setSearchText(value); // ✅ update parent
  };

  return (
    <div className="flex w-fit gap-2 rounded-md bg-[#f3f3f5] px-1 py-2">
      <div className="text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </div>
      <input
        className="bg-[#f3f3f5] text-black focus:border-gray-600 focus:outline-none focus:ring-0"
        placeholder="Search users..."
        type="text"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchEmployes;