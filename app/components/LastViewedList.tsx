'use client';
import { useEffect, useState } from 'react';

export default function LastViewedList() {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    fetch('/api/last_viewed')
      .then((res) => res.json())
      .then((data) => setNumbers(data.numbers || []));
  }, []);

  if (!numbers.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed Numbers</h2>
      <ul className="space-y-4">
        {numbers.map((item: any, idx: number) => (
          <li key={idx} className="bg-white rounded-xl shadow p-4">
            <p className="text-lg font-medium">📞 {item.number}</p>
            <p className="text-sm text-gray-600">Views: {item.views}</p>
            <p className="text-sm text-gray-600">
              Comments: {item.comments ?? 0}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
