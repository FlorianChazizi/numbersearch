'use client';
import React, { useEffect, useState } from 'react';

const rankColors: Record<string, string> = {
  useful: 'bg-green-500/70',
  safe: 'bg-teal-500/70',
  neutral: 'bg-blue-400/50',
  annoying: 'bg-red-500/70',
  dangerous: 'bg-pink-700/80',
};

const rankLabels: Record<string, string> = {
  useful: 'Χρήσιμο',
  safe: 'Ασφαλές',
  neutral: 'Ουδέτερο',
  annoying: 'Ενοχλητικό',
  dangerous: 'Επικίνδυνο',
};

export default function RecentReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/numbers') // Adjust if needed
      .then((res) => res.json())
      .then((data) => setReviews(data.numbers || []))
      .catch((err) => console.error('Failed to fetch recent reviews:', err));
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="mt-12 px-4 sm:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center sm:text-left">
        Πρόσφατες Αξιολογήσεις των αριθμών
      </h2>

      <div className="space-y-3">
        {reviews.slice(0, 10).map((review: any, idx: number) => (
          <a
            href={`/numbers/${review.number}`}
            key={review.comment_id || idx}
            className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition"
          >
            <strong className="text-pink-600 text-sm w-32 truncate">
              {review.number}
            </strong>

            <span
              className={`text-white text-sm px-4 py-1 rounded-full ${rankColors[review.rank] || 'bg-gray-400'}`}
            >
              {rankLabels[review.rank] || 'Άγνωστο'}
            </span>

            <p className="text-sm text-gray-700 w-1/2 truncate">
              {review.comment}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
