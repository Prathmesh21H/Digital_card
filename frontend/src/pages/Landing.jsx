// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT – TEXT */}
        <div>
          <span className="inline-block mb-4 px-4 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
            Digital identity made simple
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Create a beautiful <br />
            <span className="text-blue-600">digital card</span> in minutes
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-xl">
            Design, customize, and share a single link with your complete
            professional profile — no apps, no hassle.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Get started free
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border font-semibold hover:bg-gray-50 transition"
            >
              I already have an account
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required · Share instantly
          </p>
        </div>

        {/* RIGHT – STEPS / MOCK */}
        <div className="relative">
          <div className="bg-white rounded-3xl border shadow-lg p-8">
            <h3 className="text-lg font-semibold mb-4">
              Get your card live in 4 steps
            </h3>

            <ol className="space-y-4">
              {[
                "Sign up and choose a plan",
                "Add your profile & social links",
                "Customize design, fonts & colors",
                "Share your card instantly",
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Floating accent */}
          <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-blue-600/10 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}
