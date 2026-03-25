import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const imgSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `http://localhost:5000${src}`;
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const headers = { Authorization: `Bearer ${user.token}` };
  const avatarRef = useRef();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('profile');

  const flash = (m, type = 'success') => { setMsg({ text: m, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };
  const flashPw = (m, type = 'success') => { setPwMsg({ text: m, type }); setTimeout(() => setPwMsg({ text: '', type: '' }), 3000); };

  useEffect(() => {
    api.get('/api/profile', { headers }).then(r => {
      setProfile(r.data);
      setForm({ name: r.data.name || '', phone: r.data.phone || '', address: r.data.address || '' });
    });
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/api/profile/avatar', fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setProfile(data);
      updateUser({ avatar: data.avatar });
      flash('Profile photo updated!');
    } catch {
      flash('Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/api/profile', form, { headers });
      setProfile(data);
      updateUser({ name: data.name });
      flash('Profile updated successfully!');
    } catch {
      flash('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return flashPw('Passwords do not match', 'error');
    if (pwForm.newPassword.length < 6) return flashPw('Password must be at least 6 characters', 'error');
    try {
      await api.put('/api/profile/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      }, { headers });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      flashPw('Password changed successfully!');
    } catch (err) {
      flashPw(err.response?.data?.message || 'Failed', 'error');
    }
  };

  if (!profile) return <p className="text-center py-20 text-gray-400 text-sm">Loading profile...</p>;

  const avatarUrl = profile.avatar ? imgSrc(profile.avatar) : null;
  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Avatar section */}
      <div className="bg-white border border-pastel-100 rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pastel-200 bg-pastel-100 flex items-center justify-center">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-2xl font-bold text-pastel-400">{initials}</span>
            }
          </div>
          <button onClick={() => avatarRef.current.click()}
            className="absolute bottom-0 right-0 bg-pastel-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-pastel-500 transition shadow">
            📷
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Info */}
        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-gray-800">{profile.name}</p>
          <p className="text-sm text-gray-400">{profile.email}</p>
          {profile.phone && <p className="text-sm text-gray-400 mt-0.5">📞 {profile.phone}</p>}
          <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${profile.isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-pastel-100 text-pastel-600'}`}>
            {profile.isAdmin ? '👑 Admin' : '🛍️ Customer'}
          </span>
          {uploading && <p className="text-xs text-pastel-400 mt-1 animate-pulse">Uploading photo...</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === t ? 'bg-pastel-400 text-white' : 'bg-pastel-50 text-gray-600 hover:bg-pastel-100'}`}>
            {t === 'profile' ? '✏️ Edit Profile' : '🔒 Change Password'}
          </button>
        ))}
      </div>

      {/* Edit Profile */}
      {tab === 'profile' && (
        <div className="bg-white border border-pastel-100 rounded-2xl p-5">
          {msg.text && (
            <p className={`text-sm mb-4 p-3 rounded-xl ${msg.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              {msg.text}
            </p>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
              <input type="text" required placeholder="Your name"
                className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
              <input type="email" disabled value={profile.email}
                className="w-full border border-pastel-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Phone Number</label>
              <input type="tel" placeholder="Your phone number"
                className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
              <textarea placeholder="Your delivery address" rows={3} style={{ resize: 'none' }}
                className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-pastel-400 text-white py-3 rounded-xl font-semibold hover:bg-pastel-500 transition disabled:opacity-60 text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Change Password */}
      {tab === 'password' && (
        <div className="bg-white border border-pastel-100 rounded-2xl p-5">
          {pwMsg.text && (
            <p className={`text-sm mb-4 p-3 rounded-xl ${pwMsg.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              {pwMsg.text}
            </p>
          )}
          <form onSubmit={handlePassword} className="space-y-4">
            {[
              ['currentPassword', 'Current Password'],
              ['newPassword', 'New Password'],
              ['confirm', 'Confirm New Password'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                <input type="password" required placeholder={label}
                  className="w-full border border-pastel-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pastel-400"
                  value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} />
              </div>
            ))}
            <button type="submit"
              className="w-full bg-pastel-400 text-white py-3 rounded-xl font-semibold hover:bg-pastel-500 transition text-sm">
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}


