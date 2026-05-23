const FeedbackCard = ({ score, message }) => {
  const isPositive = score >= 5;

  return (
    <div className={`rounded-3xl p-6 ${isPositive ? 'bg-emerald-50' : 'bg-amber-50'}`}>
      <p className="text-sm font-semibold text-slate-900">AI feedback</p>
      <p className="mt-2 text-slate-700">{message}</p>
      <p className="mt-4 text-sm text-slate-600">Score: {score ?? 'N/A'}</p>
    </div>
  );
};

export default FeedbackCard;
