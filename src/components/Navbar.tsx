import React from 'react';

export default function Navbar() {
  return (
    <nav className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">DEUKA</h1>
        <div className="space-x-4">
          <a href="/" className="hover:underline">Learning</a>
          <a href="/quiz" className="hover:underline">Quiz</a>
          <a href="/profile" className="hover:underline">Profile</a>
          <a href="/auth/login" className="hover:underline">Login</a>
        </div>
      </div>
    </nav>
  );
}
