import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-600">LinkedIn Auto-Poster</p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900">Automate your LinkedIn coding updates</h1>
          <p className="mb-8 max-w-xl text-lg text-slate-600">
            Track GitHub, LeetCode, Codeforces, and CodeChef activity in one dashboard, generate professional posts with AI, and publish them automatically or after review.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-blue-600 px-8 py-3 text-white shadow hover:bg-blue-700"
          >
            Login with LinkedIn
          </button>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold">What you get</h2>
          <ul className="space-y-3 text-slate-600">
            <li>• Weekly activity tracking for popular coding platforms</li>
            <li>• AI-generated LinkedIn posts with emojis and hashtags</li>
            <li>• Automatic scheduling with Sunday publish options</li>
            <li>• Media upload support for certificates and screenshots</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Home;
