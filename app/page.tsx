import Searchbar from "./components/search-bar";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl py-10 flex flex-col gap-y-6 justify-center items-center px-6">
      <h1 className="text-2xl font-semibold">Search through my followers</h1>
      <p className="text-xl font-medium">Uses Typesense</p>
      <Searchbar />
    </main>
  );
}
