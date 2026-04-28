import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-left text-brand-dark">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-brand-dark">Email *</label>
          <input 
            {...register('email')}
            id="email"
            type="email" 
            autoComplete="email"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition" 
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-brand-dark">Password *</label>
          <input 
            {...register('password')}
            id="password"
            type="password" 
            autoComplete="current-password"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition" 
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Link to="/forgot-password" className="block text-blue-600 text-sm font-medium hover:underline">
          Forgotten your password?
        </Link>

        {/* Remember Me */}
        <label className="flex items-center space-x-2 text-sm text-brand-dark cursor-pointer">
          <input 
            {...register('remember')}
            id="remember"
            type="checkbox" 
            className="rounded-lg border-brand-dark/48 text-blue-500 focus:ring-0" 
          />
          <span>Stay logged in?</span>
        </label>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-black p-2 rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-sm text-brand-dark">
        <span>New to the Deuka? </span>
        <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">Find out more</Link>
        
        <Link 
          to="/auth/register" 
          className="block mt-4 w-full border border-brand-dark/48 p-2 text-center rounded-lg font-medium hover:bg-slate-50 active:scale-95 transition-all duration-100"
        >
          Register
        </Link>
      </div>
    </>
  );
}
