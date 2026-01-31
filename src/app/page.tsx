"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/en");
  }, []);

  return <p style={{ padding: 24 }}>Redirecting…</p>;
}
