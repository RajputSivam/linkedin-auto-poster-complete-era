const ActivitySummary = ({ activity }) => {
  const metrics = [
    { label: 'GitHub commits', value: activity?.github?.commits ?? 'N/A' },
    { label: 'GitHub PRs', value: activity?.github?.prs ?? 'N/A' },
    { label: 'CF rating', value: activity?.codeforces?.rating ?? 'N/A' },
    { label: 'CodeChef stars', value: activity?.codechef?.stars ?? 'N/A' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummary;
