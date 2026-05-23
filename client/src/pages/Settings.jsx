import { useEffect, useState } from 'react';
import { getMe, updateSettings } from '../services/api';

const platformFields = [
  { label: 'GitHub', key: 'githubUsername' },
  { label: 'LeetCode', key: 'leetcodeUsername' },
  { label: 'Codeforces', key: 'codeforcesHandle' },
  { label: 'CodeChef', key: 'codechefUsername' },
];

const additionalPlatforms = [
  { label: 'HackerRank', key: 'hackerrankUsername' },
  { label: 'GeeksforGeeks', key: 'gfgUsername' },
  { label: 'AtCoder', key: 'atcoderUsername' },
  { label: 'Kaggle', key: 'kaggleUsername' },
];

const Settings = () => {
  const [user, setUser] = useState(null);
  const [platform, setPlatform] = useState('');
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMe().then((res) => {
      setUser(res.data);
      setForm(res.data);
    }).catch(console.error);
  }, []);

  const handleUpdate = async () => {
    await updateSettings(form);
    setMessage('Settings updated successfully');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Connected Platforms</h2>
          <div className="space-y-3">
            {platformFields.map((item) => (
              <div key={item.key} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">{item.label}</p>
                <p className="text-slate-600">{user?.[item.key] || 'Not connected'}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-800">LinkedIn</p>
              <p className="text-slate-600">{user?.name || 'Connected user'}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Posting Mode</p>
              <select
                value={form.postingMode || 'ask-first'}
                onChange={(e) => setForm({ ...form, postingMode: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                <option value="ask-first">Ask before publishing</option>
                <option value="auto-post">Auto post every Sunday</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Schedule</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-slate-600">Every Sunday 9 PM IST</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Add platform</p>
              <div className="mt-2 flex gap-2">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="">Select platform</option>
                  {additionalPlatforms.map((item) => (
                    <option key={item.key} value={item.key}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {platform && (
              <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                <p className="font-medium text-slate-700">Add {additionalPlatforms.find((item) => item.key === platform)?.label}</p>
                <input
                  value={form[platform] || ''}
                  onChange={(e) => setForm({ ...form, [platform]: e.target.value })}
                  placeholder="Username or handle"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />
              </div>
            )}
            <button onClick={handleUpdate} className="rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
              Save settings
            </button>
            {message && <p className="text-sm text-emerald-700">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
