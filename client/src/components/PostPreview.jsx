const PostPreview = ({ content }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Post preview</h3>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">Pending</span>
      </div>
      <p className="whitespace-pre-wrap text-slate-700">{content}</p>
    </div>
  );
};

export default PostPreview;
