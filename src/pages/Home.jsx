export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold">Welcome to Axhold</h1>
        <p className="mt-4 text-lg">Diamond hands on the Avalanche chain. Transparency. Trust. Commitment.</p>
      </div>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mt-12 mb-4">About Us</h2>
        <p className="text-md">
          Axhold is a community committed to long-term holding, transparency, and building trust on the Avalanche chain.
          We aim to support promising projects by holding presale allocations responsibly and transparently.
        </p>
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700">Twitter</a>
          <a href="#" className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700">Discord</a>
          <a href="#" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700">Telegram</a>
        </div>
      </div>
    </section>
  );
}