'use client';
import React from 'react';
import SearchBanner from './components/SearchBanner';
import LastViewedList from './components/LastViewedList';

export default function Home() {
  return (
    <div >  
      <SearchBanner />
      <LastViewedList />
    </div>
  );
}
