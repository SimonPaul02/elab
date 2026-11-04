'use client';
// Alte Links wie plua.ai/#demo oder /#fluss (z. B. aus verschickten Mails) zeigten auf Abschnitte,
// die jetzt unter /planer/ liegen. Der statische Export kennt keine Redirects, darum hier im Browser.
import { useEffect } from 'react';

const UMGEZOGEN = ['#demo', '#fluss', '#datenschutz'];

export default function AlteAnker() {
  useEffect(() => {
    if (UMGEZOGEN.includes(window.location.hash)) window.location.replace(`/planer/${window.location.hash}`);
  }, []);
  return null;
}
