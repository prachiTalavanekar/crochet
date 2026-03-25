import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-pastel-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-pastel-100 p-6 md:p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">🌼</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-400 mt-1">Join CrochetBloom today</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-50 p-3 rounded-xl text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Full Name" required
            className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required
            className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required
            className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="w-full bg-pastel-400 text-white py-3 rounded-xl font-semibold hover:bg-pastel-500 transition text-sm">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-pastel-500 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}


