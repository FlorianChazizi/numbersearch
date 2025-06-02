'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBanner() {
  const [number, setNumber] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    if (!number.trim()) return;

    const res = await fetch('/api/checknumber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
    });

    if (res.ok) {
      router.push(`/numbers/${number}`);
    } else {
      alert('Number not found or error occurred.');
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16  shadow-lg mb-12">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">Δες ποιος σε κάλεσε</h1>
        <p className="text-lg mb-8 italic tracking-wide">
          "Identify unknown callers. Share your experience. Stay informed."
        </p>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter a phone number..."
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={handleSearch}
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
