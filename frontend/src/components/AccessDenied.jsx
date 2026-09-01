function AccessDenied() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-2 text-slate-600">Your role does not have permission to view this page.</p>
    </div>
  );
}

export default AccessDenied;
