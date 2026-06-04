import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: 'https://deuka.app/auth/reset-password',
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <>
        <h2 className="text-xl font-bold mb-4 text-brand-dark">Check your email</h2>
        <p className="text-sm text-gray-600 mb-6">
          We sent a password reset link to your email. Click the link to reset your password.
        </p>
        <Link to="/auth/login" className="text-blue-600 text-sm font-medium hover:underline">
          Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-brand-dark">Forgot password</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black p-2 rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6">
        <Link to="/auth/login" className="text-blue-600 text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </>
  );
}