import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-left text-[#0E2029]">Login</h2>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#0E2029]">Email *</label>
          <input 
            id="email"
            name="email"
            type="email" 
            autoComplete="email"
            className="w-full p-2 border border-[#0E2029]/0.48 rounded-lg focus:ring-1 focus:ring-[#0E2029] outline-none transition" 
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#0E2029]">Password *</label>
          <input 
            id="password"
            name="password"
            type="password" 
            autoComplete="current-password"
            className="w-full p-2 border border-[#0E2029]/0.48 rounded-lg focus:ring-1 focus:ring-[#0E2029] outline-none transition" 
          />
        </div>

        <Link to="/forgot-password" className="block text-blue-600 text-sm font-medium hover:underline">
          Forgotten your password?
        </Link>

        <label className="flex items-center space-x-2 text-sm text-[#0E2029] cursor-pointer">
          <input type="checkbox" className="rounded-lg border-[#0E2029]/0.48 text-blue-500 focus:ring-0" />
          <span>Stay logged in?</span>
        </label>

        <button 
          type="submit" 
          className="w-full bg-[#4CC3FF] text-black p-2 rounded-lg font-medium hover:bg-[#43B0E6] active:scale-95 transition-all duration-100 cursor-pointer"
        >
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-[#0E2029]">
        <span>New to the Deuka? </span>
        <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">Find out more</Link>
        
        <Link 
          to="/auth/register" 
          className="block mt-4 w-full border border-[#0E2029]/0.48 p-2 text-center rounded-lg font-medium hover:bg-slate-50 active:scale-95 transition-all duration-100"
        >
          Register
        </Link>
      </div>
    </>
  );
}