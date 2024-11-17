"use client";

import { useEffect, useState } from "react";
import typesense from "../lib/typesense";
import Image from "next/image";
import Link from "next/link";

interface IGithubUser {
  avatar_url: string;
  html_url: string;
  id: string;
  login: string;
}

type StateType = Array<{ document: IGithubUser }>;

export default function Searchbar() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<StateType>([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAutocomplete = async (q: string) => {
      try {
        const results = await typesense()
          .collections("github_followers")
          .documents()
          .search(
            {
              q,
              query_by: ["login"],
              highlight_full_fields: ["login", "id"],
              num_typos: 1,
              limit: 100,
            },
            {
              abortSignal: abortController.signal,
            }
          );
        setResults((results.hits as StateType) ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAutocomplete(searchInput);

    return () => {
      abortController.abort();
    };
  }, [searchInput]);

  return (
    <>
      <input
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-300 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        value={searchInput}
        onChange={(e) => setSearchInput(e.currentTarget.value)}
      />

      <div className="grid grid-cols-3 gap-x-10 gap-y-6">
        {results.map(({ document }) => {
          return (
            <Link href={document.html_url} key={document.id}>
              <Image
                alt=""
                src={document.avatar_url}
                width={200}
                height={200}
                className="rounded-xl"
              />
              <p className="p-1 text-lg text-slate-50">{document.login}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
