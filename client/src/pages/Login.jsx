const Login = () => {
  const loginUrl = `${import.meta.env.VITE_API_URL}/auth/linkedin`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-24">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="mb-4 text-3xl font-semibold text-slate-900">Login with LinkedIn</h1>
        <p className="mb-8 text-slate-600">Connect your LinkedIn account and get started with automated post generation.</p>
        <a
          href={loginUrl}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700"
        >
          Continue with LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Login;
