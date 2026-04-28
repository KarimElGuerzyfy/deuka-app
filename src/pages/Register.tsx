import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Registration successful! Please check your email for confirmation.');
      navigate('/auth/login');
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-left text-brand-dark">Register</h2>
      
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

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-brand-dark">Username *</label>
          <input 
            {...register('username')}
            id="username"
            type="text"
            autoComplete="username"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition" 
          />
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-brand-dark">Password *</label>
          <input 
            {...register('password')}
            id="password"
            type="password" 
            autoComplete="new-password"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition" 
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-brand-dark">Confirm Password *</label>
          <input 
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password" 
            autoComplete="new-password"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition" 
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-black p-2 rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-sm text-brand-dark">
        <span>Already have an account? </span>
        <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">Login</Link>
      </div>
    </>
  );
}
