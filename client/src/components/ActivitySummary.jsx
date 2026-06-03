const ActivitySummary = ({ activity }) => {
  const leetcodeSolved = activity?.leetcode?.solved ?? activity?.leetcodeSolved ?? 0;
  const leetcodeSubmissions = activity?.leetcode?.submissionsThisWeek ?? activity?.leetcodeSubmissions ?? 0;

  const metrics = [
    { label: 'GitHub commits', value: activity?.github?.commits ?? 0 },
    { label: 'GitHub PRs', value: activity?.github?.prs ?? 0 },
    { label: 'LeetCode solved', value: leetcodeSolved },
    { label: 'LeetCode submissions this week', value: leetcodeSubmissions },
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
