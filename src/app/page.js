"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="m-8">
      <h1 className="text-2xl font-bold">Welcome to Next.js + Tailwind 4.0</h1>
      <p>Redirecting to /login...</p>
    </div>
  );
}
