// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-black";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-blue-600"
        >
          Cardly
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link to="/" className={isActive("/")}>
            How it works
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
