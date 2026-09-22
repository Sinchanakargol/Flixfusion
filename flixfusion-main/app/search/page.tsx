import Search from "@/components/search";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Movie & TV Series Search
        </h1>
        <Search />
      </div>
    </main>
  );
}