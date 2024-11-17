import Searchbar from "./components/search-bar";

export default function Home() {
  return (
    <main className="mx-auto max-w-md py-10 flex flex-col gap-y-6">
      <h1 className="text-2xl font-semibold">Fast Search</h1>
      <Searchbar />
    </main>
  );
}
