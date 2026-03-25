import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-pastel-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-pastel-100 p-6 md:p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">🌸</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Login to your account</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-50 p-3 rounded-xl text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Email" required
            className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required
            className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="w-full bg-pastel-400 text-white py-3 rounded-xl font-semibold hover:bg-pastel-500 transition text-sm">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-pastel-500 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
