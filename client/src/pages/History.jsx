import { useEffect, useState } from 'react';
import { getPostHistory } from '../services/api';

const statusStyles = {
  published: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  skipped: 'bg-slate-100 text-slate-700',
};

const History = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostHistory().then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Post History</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[post.status] || statusStyles.pending}`}>
                {post.status}
              </span>
              <span className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <p className="whitespace-pre-wrap text-slate-700">{post.content}</p>
          </div>
        ))}
        {posts.length === 0 && <p className="text-slate-600">No posts found yet.</p>}
      </div>
    </div>
  );
};

export default History;
