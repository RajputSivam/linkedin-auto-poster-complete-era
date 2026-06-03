import { useEffect, useState } from 'react';
import { getMe, updateSettings } from '../services/api';

const platformFields = [
  { label: 'GitHub', key: 'githubUsername' },
  { label: 'LeetCode', key: 'leetcodeUsername' },
];

const Settings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [platformInputs, setPlatformInputs] = useState({
    githubUsername: '',
    leetcodeUsername: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMe().then((res) => {
      const nextUser = res.data || {};
      setUser(nextUser);
      setForm(nextUser);
      setPlatformInputs({
        githubUsername: nextUser.githubUsername || '',
        leetcodeUsername: nextUser.leetcodeUsername || '',
      });
    }).catch(console.error);
  }, []);

  const normalizePlatformValue = (key, value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';

    if (key === 'githubUsername') {
      return raw
        .replace(/^https?:\/\/github\.com\//i, '')
        .replace(/\/+$/, '')
        .replace(/^@/, '');
    }

    if (key === 'leetcodeUsername') {
      return raw
        .replace(/^https?:\/\/leetcode\.com\/(?:u|profile)\//i, '')
        .replace(/\/+$/, '')
        .replace(/^@/, '');
    }

    return raw;
  };

  const handleUpdate = async () => {
    await updateSettings(form);
    setMessage('Settings updated successfully');
  };

  const handleConnectPlatform = async (key, label) => {
    const normalizedValue = normalizePlatformValue(key, platformInputs[key]);

    try {
      await updateSettings({ [key]: normalizedValue });

      const nextUser = { ...(user || {}), [key]: normalizedValue };
      setUser(nextUser);
      setForm({ ...form, [key]: normalizedValue });
      setPlatformInputs((prev) => ({ ...prev, [key]: normalizedValue }));
      setMessage(`${label} connected successfully`);
    } catch (error) {
      console.error(error);
      setMessage(`Failed to connect ${label}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Connected Platforms</h2>
          <div className="space-y-4">
            {platformFields.map((item) => {
              const isConnected = Boolean(user?.[item.key]);

              return (
                <div key={item.key} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{item.label}</p>
                      <p className="text-sm text-slate-500">Paste a username or full profile URL</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={platformInputs[item.key] || ''}
                      onChange={(e) =>
                        setPlatformInputs((prev) => ({
                          ...prev,
                          [item.key]: e.target.value,
                        }))
                      }
                      placeholder={item.label === 'GitHub' ? 'octocat or https://github.com/octocat' : 'username or https://leetcode.com/u/username'}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleConnectPlatform(item.key, item.label)}
                      className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Connect
                    </button>
                  </div>
                  {isConnected && (
                    <p className="mt-2 text-sm text-emerald-700">Saved value: {user[item.key]}</p>
                  )}
                </div>
              );
            })}
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
