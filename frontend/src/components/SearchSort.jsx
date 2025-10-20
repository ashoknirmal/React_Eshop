import React from "react";

export default function SearchSort({ search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full md:w-48 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">Sort by</option>
        <option value="price_asc">Price low → high</option>
        <option value="price_desc">Price high → low</option>
        <option value="title_asc">Title A → Z</option>
      </select>
    </div>
  );
}
