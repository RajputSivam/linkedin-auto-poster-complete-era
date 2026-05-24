const BackendLoadingScreen = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 text-slate-900">
    <div
      className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#3B82C4]"
      role="status"
      aria-label="Loading"
    />
    <p className="text-lg font-medium text-slate-800">Connecting to server...</p>
    <p className="mt-2 text-sm text-slate-500">Waking up backend, this may take a few seconds</p>
  </div>
);

export default BackendLoadingScreen;
