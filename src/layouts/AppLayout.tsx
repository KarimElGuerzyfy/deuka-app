import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-app-bg">
      {/* The Navbar is fixed/absolute, so it doesn't take up 
        physical space in the flex flow. 
      */}
      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 
          /* Safe padding for Mobile Top Bar (~60px) */
          pt-2 
          /* Safe padding for Mobile Bottom Nav (~85px + profile overlap) */
          pb-32 
          /* Desktop padding adjustments */
          md:pt-28 md:pb-10"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}