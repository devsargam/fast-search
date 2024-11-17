"use client";

import { useState } from "react";

export default function Searchbar() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <input
      className="w-full bg-transparent placeholder:text-slate-400 text-slate-300 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      value={searchInput}
      onChange={(e) => setSearchInput(e.currentTarget.value)}
    />
  );
}
