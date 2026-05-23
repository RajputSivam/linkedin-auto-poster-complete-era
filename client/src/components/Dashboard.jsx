import { useEffect, useState } from 'react';
import { getActivity, getPendingPosts, approvePost, skipPost } from '../services/api';
import ActivitySummary from './ActivitySummary';
import PostPreview from './PostPreview';
import FeedbackCard from './FeedbackCard';
import UploadSection from './UploadSection';

const Dashboard = () => {
  const [activity, setActivity] = useState(null);
  const [pending, setPending] = useState([]);

  const loadData = async () => {
    try {
      const [activityRes, pendingRes] = await Promise.all([getActivity(), getPendingPosts()]);
      setActivity(activityRes.data);
      setPending(pendingRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    await approvePost(id);
    setPending((prev) => prev.filter((post) => post._id !== id));
  };

  const handleSkip = async (id) => {
    await skipPost(id);
    setPending((prev) => prev.filter((post) => post._id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-slate-600">Summary of your weekly coding activity and pending LinkedIn posts.</p>
      </div>
      <ActivitySummary activity={activity} />
      <UploadSection />
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold">Pending posts</h2>
        {pending.length === 0 && <p className="text-slate-600">No pending posts at the moment.</p>}
        {pending.map((post) => (
          <div key={post._id} className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-[1fr_240px]">
            <div>
              <PostPreview content={post.content} />
              <FeedbackCard score={post.feedbackScore} message={post.feedbackMessage} />
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => handleApprove(post._id)} className="rounded-full bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700">
                Approve
              </button>
              <button onClick={() => handleSkip(post._id)} className="rounded-full bg-slate-200 px-5 py-3 text-slate-800 hover:bg-slate-300">
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
