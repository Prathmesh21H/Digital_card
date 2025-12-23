// src/pages/Pricing.jsx
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    description: "Perfect to get started",
    features: [
      "Basic template",
      "Limited customization",
      "Shareable card link",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    price: "₹299",
    description: "Best for professionals",
    popular: true,
    features: [
      "All templates",
      "Advanced customization",
      "Custom branding",
      "Priority updates",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Contact us",
    description: "For teams & businesses",
    features: [
      "Team dashboards",
      "SSO authentication",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  const { plan, setPlan } = useApp();
  const nav = useNavigate();

  const choose = (id) => {
    setPlan(id);
    nav("/profile");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((p) => {
          const active = plan === p.id;

          return (
            <div
              key={p.id}
              className={`relative bg-white rounded-3xl border p-8 shadow-sm flex flex-col
                ${p.popular ? "border-blue-600 shadow-lg scale-[1.03]" : ""}
                ${active ? "ring-2 ring-blue-600" : ""}
              `}
            >
              {/* Badge */}
              {p.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold">
                  Most Popular
                </span>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <p className="mt-1 text-gray-600">{p.description}</p>

              {/* Price */}
              <div className="mt-6">
                <span className="text-4xl font-extrabold">{p.price}</span>
                {p.price !== "Contact us" && (
                  <span className="text-gray-500"> / lifetime</span>
                )}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => choose(p.id)}
                className={`mt-6 w-full py-3 rounded-xl font-semibold transition
                  ${
                    p.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border hover:bg-gray-50"
                  }
                `}
              >
                Choose {p.name}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
