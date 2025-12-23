// src/pages/Login.jsx
import { useApp } from "../context/AppContext";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const next = loc.state?.from?.pathname || "/pricing";

  const submit = (e) => {
    e.preventDefault();
    setUser({ id: "demo", email });
    nav(next, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Welcome back 👋</h2>
          <p className="mt-2 text-gray-600">
            Log in to manage your digital card
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
