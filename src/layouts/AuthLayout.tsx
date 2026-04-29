import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center relative flex flex-col items-center justify-center p-6">
      {/* Dark overlay — 66% black with multiply effect */}
      <div className="absolute inset-0 bg-black/65 mix-blend-multiply" />

      {/* Content sits above the overlay using relative z-10 */}
      <div className="relative z-10 w-full max-w-sm mb-6">
        <img src="/logo-auth.svg" alt="DEUKA" className="h-6" />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}