import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="h-dvh flex flex-col bg-app-bg overflow-hidden">
      <Navbar />
      <main className="flex-1 flex overflow-hidden justify-center">
        <Outlet />
      </main>
    </div>
  );
}