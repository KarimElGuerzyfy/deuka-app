import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#EBF9FF] p-6 flex flex-col items-center justify-center">
      {/* The Logo sits at the top, consistent for all auth pages */}
      <div className="w-full max-w-sm mb-6">
        <h1 className="text-2xl font-black text-black">DEUKA</h1>
      </div>

      {/* The card container */}
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}