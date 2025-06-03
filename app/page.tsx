'use client';
import React from 'react';
import SearchBanner from './components/SearchBanner';
import LastReview from './components/LastReview';

export default function Home() {
  return (
    <div >  
      <SearchBanner />
      <LastReview />
    </div>
  );
}
