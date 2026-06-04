import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-brand-dark">Reset password</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your new password below.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-brand-dark">New Password *</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full p-2 border border-brand-dark/48 rounded-lg focus:ring-1 focus:ring-brand-dark outline-none transition"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
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
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </>
  );
}