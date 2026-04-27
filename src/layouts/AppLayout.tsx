import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Container is here. Everything inside gets this styling. */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}