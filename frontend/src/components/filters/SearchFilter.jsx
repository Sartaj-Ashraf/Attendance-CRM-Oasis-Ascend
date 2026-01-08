import React, { useEffect, useState } from "react";

const SearchFilter = ({
  searchValue,
  onSearchChange,

  selectValue,
  onSelectChange,
  selectOptions = [],
  optionLabel = "name",
  optionValue = "_id",

  verificationValue,
  onVerificationChange,

  searchPlaceholder = "Search...",
  debounceDelay = 400,
  showSelect = true,
  showVerification = true,
  showClear = true,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // sync external search
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [localSearch, debounceDelay, onSearchChange]);

  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
    onSelectChange?.("");
    onVerificationChange?.("all");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
      {/* SEARCH */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {showClear && localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* DEPARTMENT */}
    {showSelect && (
  <select
    value={selectValue}
    onChange={(e) => onSelectChange(e.target.value)}
    className="w-full sm:w-48 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Departments</option>

    {Array.isArray(selectOptions) &&
      selectOptions.map((opt) => (
        <option key={opt[optionValue]} value={opt[optionValue]}>
          {opt[optionLabel]}
        </option>
      ))}
  </select>
)}

      {/* 🆕 VERIFIED FILTER */}
      {showVerification && (
        <select
          value={verificationValue}
          onChange={(e) => onVerificationChange(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      )}
    </div>
  );
};

export default SearchFilter;
