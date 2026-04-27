import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-left text-[#0E2029]">Register</h2>
      
      <form className="space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#0E2029]">Password *</label>
          <input 
            id="password"
            name="password"
            type="password" 
            autoComplete="new-password"
            className="w-full p-2 border border-[#0E2029]/0.48 rounded-lg focus:ring-1 focus:ring-[#0E2029] outline-none transition" 
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-[#0E2029]">Confirm Password *</label>
          <input 
            id="confirmPassword"
            name="confirmPassword"
            type="password" 
            autoComplete="new-password"
            className="w-full p-2 border border-[#0E2029]/0.48 rounded-lg focus:ring-1 focus:ring-[#0E2029] outline-none transition" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#4CC3FF] text-black p-2 rounded-lg font-medium hover:bg-[#43B0E6] active:scale-95 transition-all duration-100 cursor-pointer"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-sm text-[#0E2029]">
        <span>Already have an account? </span>
        <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">Login</Link>
      </div>
    </>
  );
}