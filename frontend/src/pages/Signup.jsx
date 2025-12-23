// src/pages/Signup.jsx
import { useApp } from "../context/AppContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setUser({ id: crypto.randomUUID(), email });
    nav("/pricing");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create your account 🚀</h2>
          <p className="mt-2 text-gray-600">
            Start building your digital card in minutes
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

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
