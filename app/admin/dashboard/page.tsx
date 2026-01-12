// filepath: c:\Users\habib\OneDrive\UNIVERSITAS GUNADARMA\Semester6\Pengelolaan Proyek Sistem Informasi\SITALARIS\project-lurah\app\login\page.tsx
'use client';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Redirect berdasarkan role setelah login
      if (session.user.isAdmin) {
        router.push('/admin/dashboard');
        
      } else {
        router.push('/dashboard');
        
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Jangan redirect otomatis, biarkan useEffect handle
    });
    if (result?.error) {
      setError(result.error);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
        <h1 className="text-2xl mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 mb-2 border"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 mb-4 border"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">Login</button>
      </form>
    </div>
  );
}