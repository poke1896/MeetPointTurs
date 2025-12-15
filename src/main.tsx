import React from 'react';
import { createRoot } from 'react-dom/client';
import MeetingBanner from './components/MeetingBanner';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <React.StrictMode>
    <MeetingBanner
      meetingTimeText="5:30 PM"
      locationLabel="Designated Meeting Point"
      locationUrl="https://maps.google.com/?q=Central%20Meeting%20Point"
      locale="es-ES"
      brandName="MeetPoint Tours"
      palette="teal"
    />
  </React.StrictMode>
);
